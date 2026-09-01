import { Request, Response, NextFunction } from 'express';
import { TicketService } from './ticket.service.js';
import { TicketFilters } from './ticket.types.js';

export class TicketController {
  private service: TicketService;

  constructor() {
    this.service = new TicketService();
  }

  getAllTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters: TicketFilters = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        search: req.query.search as string,
        status: req.query.status as any,
        priority: req.query.priority as any,
        category: req.query.category as any,
        assigneeId: req.query.assigneeId ? parseInt(req.query.assigneeId as string) : undefined,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };

      const result = await this.service.getAllTickets(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getTicketById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.service.getTicketById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  createTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.createTicket(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.service.updateTicket(id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  updateTicketStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const result = await this.service.updateTicketStatus(id, status);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.service.deleteTicket(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
