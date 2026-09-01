import axios from "axios";
import type { User } from "../types/user.types";
import type { ApiResponse } from "../../../shared/types/api.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const userApi = {};
