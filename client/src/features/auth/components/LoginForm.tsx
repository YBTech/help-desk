import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types/auth.types";
import styles from "./LoginForm.module.css";

const VALID_USERNAMES = ["admin", "alice", "bob", "carol", "dave"] as const;

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!VALID_USERNAMES.includes(username as (typeof VALID_USERNAMES)[number])) {
      setError("Username must be one of: admin, alice, bob, carol, or dave");
      return;
    }

    if (password !== "123") {
      setError("Wrong password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Login failed");
      }

      const user = payload?.data as User | undefined;

      if (!user) {
        throw new Error("Invalid user response");
      }

      login(user);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Username</label>
          <input
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className={styles.hint}>
        <p>Try: admin, alice, bob, carol, or dave</p>
        <p>Password: 123</p>
      </div>
    </>
  );
}
