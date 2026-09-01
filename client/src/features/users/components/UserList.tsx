import type { UserRole } from "../types/user.types";
import styles from "./UserList.module.css";

export function UserList() {
  // 🔴 TODO:
  // 1. use controlled component
  // 2. Fetch users from http://localhost:4000/api/users (bonus: extract to userApi.ts)
  // 3. be able to filter by role and sort by name (asc/desc) using the select inputs
  // 4. Display loading/error states, show "No users found" when the list is empty,
  //    otherwise render a <tr> for each user using .map() — remember the key prop
  // 5. use useMemo hook to optimize the rendering performance
  // bonus: create a useUsers custom hook to encapsulate the fetching/filtering/sorting logic and state management

  // don't change, helper function to get the CSS class for the role badge
  const getRoleBadgeClass = (role: UserRole) => {
    if (role === "admin") return `${styles.roleBadge} ${styles.roleAdmin}`;
    if (role === "agent") return `${styles.roleBadge} ${styles.roleAgent}`;
    return `${styles.roleBadge} ${styles.roleViewer}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Users</h1>
      </div>

      <div className={styles.controls}>
        <label>
          Role
          <select>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>

        <label>
          Sort by Name
          <select>
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </label>

        <span className={styles.resultCount}>
          {/* 🔴 Todo: replace hardcoded count with actual count after filtering */}
          3 users
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
          <tr>
            <td>Admin User</td>
            <td>admin</td>
            <td>admin@helpdesk.com</td>
            <td>
              <span className={getRoleBadgeClass("admin")}>admin</span>
            </td>
            <td>6/1/2026</td>
          </tr>
          <tr>
            <td>Alice Johnson</td>
            <td>alice</td>
            <td>alice@helpdesk.com</td>
            <td>
              <span className={getRoleBadgeClass("agent")}>agent</span>
            </td>
            <td>6/1/2026</td>
          </tr>
          <tr>
            <td>Dave Brown</td>
            <td>dave</td>
            <td>dave@helpdesk.com</td>
            <td>
              <span className={getRoleBadgeClass("viewer")}>viewer</span>
            </td>
            <td>6/1/2026</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
