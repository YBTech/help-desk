import { db } from '../../db/index.js';
import { tickets } from '../../db/schema.js';
import { eq, and, count, sql, desc, lt } from 'drizzle-orm';

export class StatsRepository {
  async getTicketCounts() {
    const statusCounts = await db
      .select({
        status: tickets.status,
        count: count(),
      })
      .from(tickets)
      .groupBy(tickets.status);

    const priorityCounts = await db
      .select({
        priority: tickets.priority,
        count: count(),
      })
      .from(tickets)
      .groupBy(tickets.priority);

    return { statusCounts, priorityCounts };
  }

  async getAvgResolutionTime() {
    const result = await db
      .select({
        avgTime: sql<number>`AVG(${tickets.resolvedAt} - ${tickets.createdAt})`,
      })
      .from(tickets)
      .where(sql`${tickets.resolvedAt} IS NOT NULL`);

    return result[0]?.avgTime || 0;
  }

  async getSlaBreachCount() {
    const nowSeconds = Math.floor(Date.now() / 1000);

    const result = await db
      .select({ count: count() })
      .from(tickets)
      .where(
        sql`(${tickets.resolvedAt} > ${tickets.slaDeadline}) OR (${tickets.resolvedAt} IS NULL AND ${tickets.closedAt} IS NULL AND ${tickets.slaDeadline} < ${nowSeconds})`
      );

    return result[0]?.count || 0;
  }

  async getTotalCount() {
    const result = await db.select({ count: count() }).from(tickets);
    return result[0]?.count || 0;
  }

  async getRecentTickets(limit: number = 5) {
    return await db
      .select()
      .from(tickets)
      .orderBy(desc(tickets.updatedAt))
      .limit(limit);
  }
}
