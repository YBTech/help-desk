import { StatsRepository } from './stats.repository.js';

export class StatsService {
  private repository: StatsRepository;

  constructor() {
    this.repository = new StatsRepository();
  }

  async getStats() {
    const [
      { statusCounts, priorityCounts },
      avgResolutionTime,
      slaBreachCount,
      totalCount,
    ] = await Promise.all([
      this.repository.getTicketCounts(),
      this.repository.getAvgResolutionTime(),
      this.repository.getSlaBreachCount(),
      this.repository.getTotalCount(),
    ]);

    const statusMap: Record<string, number> = {};
    statusCounts.forEach(item => {
      statusMap[item.status] = item.count;
    });

    const priorityMap: Record<string, number> = {};
    priorityCounts.forEach(item => {
      priorityMap[item.priority] = item.count;
    });

    return {
      success: true,
      data: {
        totalTickets: totalCount,
        openTickets: statusMap['open'] || 0,
        avgResolutionTimeSeconds: Math.round(avgResolutionTime),
        slaBreachCount,
        statusCounts: statusMap,
        priorityCounts: priorityMap,
      },
    };
  }

  async getRecent() {
    const tickets = await this.repository.getRecentTickets(5);

    return {
      success: true,
      data: tickets,
    };
  }
}
