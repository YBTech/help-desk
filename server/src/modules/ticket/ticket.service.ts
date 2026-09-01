import { TicketRepository } from "./ticket.repository.js";
import { NotImplementedError } from "../../shared/errors.js";
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
    throw new NotImplementedError("TODO: Implement backend logic for: getTicketById in ticket.service.ts");
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
    throw new NotImplementedError("TODO: Implement backend logic for: createTicket in ticket.service.ts");
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
    throw new NotImplementedError("TODO: Implement backend logic for: updateTicket in ticket.service.ts");
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
    throw new NotImplementedError("TODO: Implement backend logic for: updateTicketStatus in ticket.service.ts");
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
    throw new NotImplementedError("TODO: Implement backend logic for: deleteTicket in ticket.service.ts");
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
