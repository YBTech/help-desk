# Helpdesk Ticket Tracker

A fullstack MERN helpdesk system for managing support tickets with SLA tracking, status workflows, and dashboard analytics.

## Quick Start

```bash
npm run install:all
npm run dev
```

- **Frontend**: http://localhost:5173
- **API Doc** http://localhost:5173/docs/api
- **Backend API**: http://localhost:4000/api

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, React Router v6, Axios, CSS Modules
- **Backend**: Node.js, Express, TypeScript
- **Database**: In-memory SQLite (better-sqlite3) with Drizzle ORM

## Requirements

Complete every item marked 🔴 in the source files. The list below maps each task to the exact file you need to edit.

---

### 1. Auth — `src/features/auth/`

**`context/AuthContext.tsx`**
- Implement the `login(user)` function — update the user state
- Implement the `logout()` function — reset user state to null
- Pass `{ user, login, logout }` as the `value` prop to `AuthContext.Provider`
- Finish the `useAuth()` hook — call `useContext(AuthContext)`, throw an error if used outside the provider, return the context value
- Wrap `<AuthProvider>` around the app in `src/main.tsx`

**`components/LoginForm.tsx`**
- Add controlled state for username and password inputs
- On submit: call `POST /api/users/login` with the username, call `login()` from context on success, display an error message on failure
- Close the dropdown after successful login (a `onSuccess` callback prop is already threaded through from `UserBadge`)

**`components/UserBadge.tsx`**
- Replace `const user = null` with `useAuth()` to get the real user
- Display `user.displayName` and `user.role` when logged in
- Wire the Logout button to call `logout()` from context

Reference screenshots: `src/features/auth/login-form.png`, `login-failed.png`, `after-login.png`

---

### 2. Dashboard — `src/features/dashboard/`

**`components/Dashboard.tsx`**
- Fetch data from `GET /api/stats` and `GET /api/stats/recent` on mount
- Handle loading and error states
- Pass the fetched stats to `<StatsPanel>` and the recent tickets to `<RecentActivity>`

**`components/StatsPanel.tsx`**
- Accept a `stats` prop and replace the hardcoded placeholder values with real data

**`components/RecentActivity.tsx`**
- Accept a `tickets` prop and replace the hardcoded links with a `.map()` over the real tickets

Reference screenshot: `src/features/dashboard/dashboard.png`

---

### 3. Users — `src/features/users/`

**`hooks/useUsers.ts`**
- Implement the hook: fetch all users from `GET /api/users` using `useEffect`
- Return `{ users, loading, error }`

**`components/UserList.tsx`**
- Add controlled state for the role filter and sort order selects
- Call `useUsers()` and handle loading and error states
- Use `useMemo` to filter by role and sort by display name based on the select values
- Replace the hardcoded `<tr>` rows with `.map()` over the filtered/sorted users
- Update the result count to reflect the filtered list
- Show "No users found" when the filtered list is empty

Reference screenshot: `src/features/users/users-page.png`

---

### 4. Tickets (frontend) — `src/features/tickets/`

**`hooks/useTickets.ts`**
- Implement the hook: fetch tickets from `GET /api/tickets` using `useEffect`, passing all filter/pagination params as query string
- Return `{ tickets, loading, error, pagination, refetch }`

**`components/TicketList.tsx`**
- Wire `useDebouncedValue` to debounce the search input (300ms) before passing it to `useTickets`
- Implement loading and error states
- Replace the two hardcoded `<TicketCard>` placeholders with `.map()` over the real tickets
- Show "No tickets found" when the list is empty

**`components/TicketCreateForm.tsx`**
- Add controlled state for all fields: title, description, priority, category, reporterName, reporterEmail, assigneeId
- Fetch users from `GET /api/users` on mount and render them as options in the Assignee dropdown
- Implement client-side validation: title min 5 chars, description/reporterName required, reporterEmail must be valid email — display inline error messages under each field
- On submit: `POST /api/tickets` with the form data, navigate to `/tickets/:id` using the returned ticket id
- Disable the submit button and show "Saving..." while the request is in flight

Reference screenshot: `src/features/tickets/tickets-page.png`

---

### 5. Tickets (backend) — `server/src/modules/ticket/`

**`ticket.service.ts`**

All methods use `this.repository` (already implemented) and should follow the response shape shown in the inline comments.

- **`getTicketById(id)`** — find the ticket; throw `NotFoundError` if not found; return `{ success: true, data: ticket }`
- **`createTicket(data)`** — call `this.calculateSlaDeadline(data.priority)` to get the deadline; create via repository; return `{ success: true, data: ticket, message: "Ticket created successfully" }`
- **`updateTicket(id, data)`** — throw `NotFoundError` if ticket doesn't exist; update via repository; return `{ success: true, data: ticket, message: "Ticket updated successfully" }`
- **`updateTicketStatus(id, newStatus)`** — throw `NotFoundError` if not found; validate transition with `this.isValidStatusTransition()`; throw `ConflictError` on invalid transition; set `resolvedAt` when resolving, `closedAt` when closing; update via repository
- **`deleteTicket(id)`** — throw `NotFoundError` if not found; delete via repository; return `{ success: true, message: "Ticket deleted successfully" }`

---

## API Endpoints

Run the app and visit **http://localhost:5173/docs/api** for the full interactive API reference with request/response examples.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tickets` | List tickets (paginated, filterable) |
| GET | `/api/tickets/:id` | Get ticket details |
| POST | `/api/tickets` | Create ticket |
| PUT | `/api/tickets/:id` | Update ticket |
| PATCH | `/api/tickets/:id/status` | Update ticket status |
| DELETE | `/api/tickets/:id` | Delete ticket |
| GET | `/api/users` | List all users |
| POST | `/api/users/login` | Simple login |
| GET | `/api/stats` | Dashboard statistics |
| GET | `/api/stats/recent` | Recent tickets |

---

## Hints

### Shared Components (`src/shared/components/`)

Don't build these from scratch — they're already there:

- **`<LoadingSpinner />`** — drop-in loading state, no props needed
- **`<StatusBadge status={...} />`** — renders a styled badge for ticket status values (`open`, `in_progress`, `resolved`, `closed`)
- **`<PriorityBadge priority={...} />`** — renders a styled badge for priority values (`urgent`, `high`, `medium`, `low`)
- **`<ErrorBoundary />`** — wraps subtrees to catch render errors
- **`<NotFound />`** — use for unmatched routes

### Shared Utilities (`src/shared/utils/formatters.ts`)

- **`formatDate(dateString)`** — formats an ISO date string to a readable `Mon DD, YYYY, HH:MM AM/PM` string
- **`formatTimeRemaining(deadline)`** — takes an SLA deadline string and returns `Xh Ym Zs` remaining, or `"BREACHED"` if past due
- **`formatDuration(seconds)`** — converts a seconds value to `Xh Ym` (useful for avg resolution time on the dashboard)

### Shared Hook (`src/shared/hooks/useDebouncedValue.ts`)

- **`useDebouncedValue(value, delay)`** — debounces any value; the tickets requirement specifically calls for 300ms on the search input

### Feature Types (`src/features/<feature>/types/`)

Each feature has its TypeScript types already defined — import from these instead of writing your own:

| Import path | Key types |
|---|---|
| `features/auth/types/auth.types.ts` | `User`, `AuthContextType` |
| `features/tickets/types/ticket.types.ts` | `Ticket`, `CreateTicketData`, `TicketStatus`, `TicketPriority`, `PaginatedResponse` |
| `features/users/types/user.types.ts` | `User` (agent/admin shape) |
| `features/dashboard/types/dashboard.types.ts` | `DashboardStats` |

### Shared API Types (`src/shared/types/api.types.ts`)

Generic response wrappers (`ApiResponse<T>`, `PaginatedApiResponse<T>`) used across all Axios calls.
