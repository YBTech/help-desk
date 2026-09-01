import { StatsPanel } from "./StatsPanel";
import { RecentActivity } from "./RecentActivity";
import styles from "./Dashboard.module.css";

// http://localhost:4000/api/stats
// http://localhost:4000/api/stats/recent

export function Dashboard() {
  // 🔴 TODO:
  // 1. use "fetch" to get data from http://localhost:4000/api/stats and http://localhost:4000/api/stats/recent
  // 2. display the stats and recent activity data
  // 3. handle loading and error states
  // Bonus: extract the data fetching logic into dashboardApi.ts

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <StatsPanel />
      <RecentActivity />
    </div>
  );
}
