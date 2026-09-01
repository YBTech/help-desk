import axios from "axios";
import type { DashboardStats } from "../types/dashboard.types";
import type { Ticket } from "../../tickets/types/ticket.types";
import type { ApiResponse } from "../../../shared/types/api.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// 🔴 Todo: bonus
export const dashboardApi = {
  getStats: () => {},

  getRecent: () => {},
};
