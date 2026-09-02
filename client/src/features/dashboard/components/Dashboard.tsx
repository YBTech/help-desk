import { StatsPanel } from "./StatsPanel";
import { RecentActivity } from "./RecentActivity";
import styles from "./Dashboard.module.css";
import { useState, useEffect } from "react";
import type { DashboardStats } from "../types/dashboard.types";
import type { ApiResponse } from "../../../shared/types/api.types";
import type { Ticket } from "../../tickets/types/ticket.types";

// http://localhost:4000/api/stats
// http://localhost:4000/api/stats/recent
const url = "http://localhost:4000/api";

export function Dashboard() {
  // 🔴 TODO:
  // 1. use "fetch" to get data from http://localhost:4000/api/stats and http://localhost:4000/api/stats/recent
  // 2. display the stats and recent activity data
  // 3. handle loading and error states
  // Bonus: extract the data fetching logic into dashboardApi.ts
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Ticket[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [statsResponse, recentResponse] = await Promise.all([
          fetch(`${url}/stats`),
          fetch(`${url}/stats/recent`),
        ]);

        if (!statsResponse.ok) {
          throw new Error("Failed to fetch stats");
        }
        if (!recentResponse.ok) {
          throw new Error("Failed to fetch recent activity");
        }

        const statsData: ApiResponse<DashboardStats> = await statsResponse.json();
        const recentData: ApiResponse<Ticket[]> = await recentResponse.json();

        setStats(statsData.data);
        setRecentActivity(recentData.data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if(loading) {
    return <div>
      <h1>Dashboard</h1>
      <p>Loading dashboard...</p>
    </div>;
  }

  if(error) {
    return <div>
      <h1>Dashboard</h1>
      <p role="alert">{error}</p>
    </div>;
  }

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>

      {stats && <StatsPanel stats={stats} />}
      {recentActivity && <RecentActivity tickets={recentActivity} />}
    </div>
  );
}
