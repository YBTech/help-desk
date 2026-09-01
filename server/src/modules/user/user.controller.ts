import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service.js';

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.getAllUsers();
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.service.getUserById(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.body;
      const result = await this.service.login(username);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
