import { UserRepository } from './user.repository.js';
import { NotFoundError } from '../../shared/errors.js';
import { loginSchema } from './user.schema.js';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async getAllUsers() {
    const users = await this.repository.findAll();
    return {
      success: true,
      data: users,
    };
  }

  async getUserById(id: number) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return {
      success: true,
      data: user,
    };
  }

  async login(username: string) {
    loginSchema.parse({ username });

    const user = await this.repository.findByUsername(username);

    if (!user) {
      throw new NotFoundError(`User with username ${username} not found`);
    }

    return {
      success: true,
      data: user,
      message: 'Login successful',
    };
  }
}
