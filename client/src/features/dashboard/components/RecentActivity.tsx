import { Link } from "react-router-dom";
import { StatusBadge } from "../../../shared/components/Badges";
import styles from "./RecentActivity.module.css";
import type { Ticket } from "../../tickets/types/ticket.types";
import { formatDate } from "../../../shared/utils/formatters";

interface RecentActivityProps {
  tickets: Ticket[];
}

// 🔴 TODO: Accept tickets prop (Ticket[]) and render each ticket as a link with title, updated date, and status badge
export function RecentActivity({ tickets }: RecentActivityProps) {
  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Recent Activity</h2>
      <div className={styles.list}>
        {tickets.map((ticket) => (
          <Link to={`/tickets/${ticket.id}`} className={styles.item} key={ticket.id}>
            <div className={styles.itemRow}>
              <div>
                <div className={styles.itemTitle}>
                  {ticket.title}
                </div>
                <div className={styles.itemDate}>Updated {formatDate(ticket.updatedAt)}</div>
              </div>
              <StatusBadge status={ticket.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
