import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export class UserRepository {
  async findAll() {
    return await db.select().from(users);
  }

  async findById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user || null;
  }

  async findByUsername(username: string) {
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return user || null;
  }
}
