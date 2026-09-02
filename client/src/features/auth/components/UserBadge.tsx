import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { LoginForm } from "./LoginForm";
import styles from "./UserBadge.module.css";

export function UserBadge() {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) {
    return (
      <div ref={dropdownRef} className={styles.loginWrapper}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={styles.loginButton}
        >
          Login
        </button>
        {open && (
          <div className={styles.dropdown}>
            <LoginForm onSuccess={() => setOpen(false)} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.userInfo}>
      <div className={styles.userText}>
        <div className={styles.userName}>{user.displayName}</div>
        <div className={styles.userRole}>{user.role}</div>
      </div>
      <button className={styles.logoutButton} onClick={logout}>
        Logout
      </button>
    </div>
  );
}
