import { TicketRepository } from "./ticket.repository.js";
import { NotFoundError, NotImplementedError, ConflictError } from "../../shared/errors.js";
import {
  TicketFilters,
  CreateTicketDto,
  UpdateTicketDto,
  TicketStatus,
} from "./ticket.types.js";

export class TicketService {
  private repository: TicketRepository;

  constructor() {
    this.repository = new TicketRepository();
  }

  async getAllTickets(filters: TicketFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const { results, totalCount } = await this.repository.findAll(filters);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages,
      },
    };
  }

  // 🔴 Todo: Check if ticket exists
  // - if exists, return it
  // - if not exists, throw NotFoundError
  // successful response schema:
  // {
  //   success: true,
  //   data: ticket
  // }
  async getTicketById(id: number) {
    const ticket = await this.repository.findById(id);
    if (!ticket) {
      throw new NotImplementedError(`Ticket with ID ${id} not found.`);
    }
    return {
      success: true,
      data: ticket,
    };
  }

  // 🔴 Todo: Create a new ticket
  // - use this.calculateSlaDeadline(data.priority) to compute the slaDeadline
  // - create the ticket via repository (pass data + slaDeadline)
  // successful response schema:
  // {
  //   success: true,
  //   data: ticket,
  //   message: "Ticket created successfully"
  // }
  async createTicket(data: CreateTicketDto) {
    const slaDeadline = this.calculateSlaDeadline(data.priority);
    const ticket = await this.repository.create({ ...data, slaDeadline });
    return {
      success: true,
      data: ticket,
      message: "Ticket created successfully",
    };
  }

  // 🔴 Todo: Update an existing ticket
  // - if ticket does not exist, throw NotFoundError
  // - update the ticket via repository
  // successful response schema:
  // {
  //   success: true,
  //   data: ticket,
  //   message: "Ticket updated successfully"
  // }
  async updateTicket(id: number, data: UpdateTicketDto) {
    const ticket = await this.repository.findById(id);
    if (!ticket) {
      throw new NotImplementedError(`Ticket with ID ${id} not found.`);
    }
    const updatedTicket = await this.repository.update(id, data);
    return {
      success: true,
      data: updatedTicket,
      message: "Ticket updated successfully",
    };
  }

  // 🔴 Todo: Update ticket status
  // - if ticket does not exist, throw NotFoundError
  // - validate the transition using this.isValidStatusTransition(currentStatus, newStatus)
  //   if invalid, throw ConflictError
  // - when transitioning to "resolved", set resolvedAt = new Date()
  // - when transitioning to "closed", set closedAt = new Date()
  // - update via repository, passing the new status and timestamps
  // successful response schema:
  // {
  //   success: true,
  //   data: updatedTicket,
  //   message: "Ticket status updated successfully"
  // }
  async updateTicketStatus(id: number, newStatus: TicketStatus) {
    const existingTicket = await this.repository.findById(id);

    if (!existingTicket) {
      throw new NotFoundError(`Ticket with ID ${id} was not found`);
    }

    const currentStatus = existingTicket.status as TicketStatus;

    const validTransition = this.isValidStatusTransition(
      currentStatus,
      newStatus,
    );

    if (!validTransition) {
      throw new ConflictError(
        `Cannot change ticket status from "${currentStatus}" to "${newStatus}"`,
      );
    }

    const timestamps: {
      resolvedAt?: Date;
      closedAt?: Date;
    } = {};

    if (newStatus === "resolved") {
      timestamps.resolvedAt = new Date();
    }

    if (newStatus === "closed") {
      timestamps.closedAt = new Date();
    }

    const updatedTicket = await this.repository.updateStatus(
      id,
      newStatus,
      timestamps,
    );

    return {
      success: true,
      data: updatedTicket,
      message: "Ticket status updated successfully",
    };
  }

  // 🔴 Todo: Check if ticket exists
  // - if exists, delete via repository
  // - if not exists, throw NotFoundError
  // successful response schema:
  // {
  //   success: true,
  //   message: "Ticket deleted successfully"
  // }
  async deleteTicket(id: number) {
    const ticket = await this.repository.exists(id);
    if (!ticket) {
      throw new NotFoundError(`Ticket with ID ${id} was not found`);
    }

    await this.repository.delete(id);

    return {
      success: true,
      message: "Ticket deleted successfully",
    };
  }

  private calculateSlaDeadline(priority: string): Date {
    const now = new Date();
    const hourMs = 60 * 60 * 1000;

    const slaHours: Record<string, number> = {
      urgent: 4,
      high: 8,
      medium: 24,
      low: 72,
    };

    const hours = slaHours[priority] || 24;
    return new Date(now.getTime() + hours * hourMs);
  }

  private isValidStatusTransition(
    current: TicketStatus,
    next: TicketStatus,
  ): boolean {
    const validTransitions: Record<TicketStatus, TicketStatus[]> = {
      open: ["in_progress"],
      in_progress: ["resolved", "open"],
      resolved: ["closed", "open"],
      closed: ["open"],
    };

    return validTransitions[current]?.includes(next) || false;
  }
}
