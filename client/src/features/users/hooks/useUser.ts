// bonus task: create a useUsers custom hook to encapsulate the fetching/filtering/sorting logic and state management
import { useState, useEffect } from "react";
import type { User } from "../types/user.types";
import type { ApiResponse } from "../../../shared/types/api.types";

const USERS_API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
};

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const response = await fetch(`${USERS_API_URL}/users`);
        const data: ApiResponse<User[]> = await response.json();
        if(!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }
        setUsers(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
    }, []);
  return { users, loading, error };
}