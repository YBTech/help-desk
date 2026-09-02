import type { UserRole } from "../types/user.types";
import styles from "./UserList.module.css";
import { useState, useMemo } from "react";
import { useUsers } from "../hooks/useUser";

type RoleFilter = UserRole | "";
type SortOrder = "asc" | "desc";

export function UserList() {
  // 🔴 TODO:
  // 1. use controlled component
  // 2. Fetch users from http://localhost:4000/api/users (bonus: extract to userApi.ts)
  // 3. be able to filter by role and sort by name (asc/desc) using the select inputs
  // 4. Display loading/error states, show "No users found" when the list is empty,
  //    otherwise render a <tr> for each user using .map() — remember the key prop
  // 5. use useMemo hook to optimize the rendering performance
  // bonus: create a useUsers custom hook to encapsulate the fetching/filtering/sorting logic and state management

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const { users, loading, error } = useUsers();

  const filteredAndSortedUsers = useMemo(() => {
    let filteredUsers = users;

    if (roleFilter) {
      filteredUsers = filteredUsers.filter((user) => user.role === roleFilter);
    }

    return filteredUsers.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.displayName.localeCompare(b.displayName);
      } else {
        return b.displayName.localeCompare(a.displayName);
      }
    });
  }, [users, roleFilter, sortOrder]);

  // don't change, helper function to get the CSS class for the role badge
  const getRoleBadgeClass = (role: UserRole) => {
    if (role === "admin") return `${styles.roleBadge} ${styles.roleAdmin}`;
    if (role === "agent") return `${styles.roleBadge} ${styles.roleAgent}`;
    return `${styles.roleBadge} ${styles.roleViewer}`;
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error loading users: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Users</h1>
      </div>

      <div className={styles.controls}>
        <label>
          Role
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as RoleFilter)}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>

        <label>
          Sort by Name
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value as SortOrder)}>
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </label>

        <span className={styles.resultCount}>
          {/* 🔴 Todo: replace hardcoded count with actual count after filtering */}
          {filteredAndSortedUsers.length} users
          {filteredAndSortedUsers.length === 0 && <span> - No users found</span>}
        </span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Display Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {/* 🔴 TODO: replace hardcoded rows with filteredAndSorted.map() */}
          {filteredAndSortedUsers.map(user => (
            <tr key={user.id}>
              <td>{user.displayName}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
