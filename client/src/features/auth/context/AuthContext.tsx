import { createContext, useState, type ReactNode } from "react";
import type { User } from "../types/auth.types";

const url = "http://localhost:4000/api/users";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔴 Todo:
// 1. implement the login and logout functions to update the user state.
// 2. wrap the AuthProvider around appropriate components in the app to provide global state management for authentication.

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return <AuthContext.Provider>{children}</AuthContext.Provider>;
}

// 🔴 Todo: finish the useAuth hook
export function useAuth() {}
