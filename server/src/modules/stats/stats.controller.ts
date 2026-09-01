import { Request, Response, NextFunction } from 'express';
import { StatsService } from './stats.service.js';

export class StatsController {
  private service: StatsService;

  constructor() {
    this.service = new StatsService();
  }

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getStats();
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getRecent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getRecent();
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
