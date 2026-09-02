import { formatDuration } from "../../../shared/utils/formatters";
import type { DashboardStats } from "../types/dashboard.types";
import styles from "./StatsPanel.module.css";

const mockStats = [
  { title: "Open", value: 12, color: "#3498db" },
  { title: "In Progress", value: 8, color: "#e67e22" },
  { title: "Resolved", value: 24, color: "#2ecc71" },
  { title: "Urgent", value: 3, color: "#e74c3c" },
];

interface StatsPanelProps {
  stats: DashboardStats;
}

// 🔴 TODO: Accept stats prop (DashboardStats) and use its properties dynamically
export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className={styles.grid}>
        <StatCard
          title="Total Tickets"
          value={stats.totalTickets}
          color="#3498db"
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets}
          color="#e67e22"
        />
        <StatCard
          title="Average Resolution Time (s)"
          value={formatDuration(stats.avgResolutionTimeSeconds)}
          color="#2ecc71"
        />
        <StatCard
          title="SLA Breaches"
          value={stats.slaBreachCount}
          color="#e74c3c"
        />
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={styles.card} style={{ borderLeft: `4px solid ${color}` }}>
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardValue}>{value}</div>
    </div>
  );
}
