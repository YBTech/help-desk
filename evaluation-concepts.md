# Evaluation Concepts

## Concepts Being Tested

### React Core
- `useState` — local UI state, form fields, filter state
- `useEffect` — data fetching on mount
- `useMemo` — deriving filtered/sorted lists without re-fetching (UserList)
- Context API — `createContext`, `useContext`, Provider, custom hook with usage guard (AuthContext)
- Custom hooks — encapsulating fetch logic (`useTickets`, `useUsers`)

### Data & Async
- `async` / `await`
- `try` / `catch` / `finally` for error handling
- Axios for HTTP requests
- Handling loading / error / success states

### Component Patterns
- Controlled components — form inputs bound to state
- Conditional rendering — loading spinners, error messages, empty states, disabled buttons
- Rendering lists — `.map()` with `key` prop
- Form validation — client-side, inline error messages

### Client-side vs. Server-side Data Handling
- Server-side filtering, sorting, and pagination (useTickets — query params passed to API)
- Client-side filtering and sorting with `useMemo` (UserList — all data fetched once, filtered in-memory)

### UX Patterns
- Debouncing search input (`useDebouncedValue`)

### Backend Service Layer
- Implementing service methods: fetch by ID, create, update, update status, delete
- Throwing typed errors (`NotFoundError`, `ConflictError`) for invalid operations

---

## Concepts NOT Being Tested

- CSS / styling
- React Router configuration (router setup file)
    - `Link` and `NavLink` for navigation
    - `useSearchParams` — reading and writing URL query params (pre-built in TicketList)
    - `useParams` — reading route parameters (pre-built in TicketDetail, TicketCreateForm)
    - `useRef` — focusing elements (pre-built in TicketDetail)
- Express controllers and repository layer (pre-built)
- SQL / database queries
- Schema validation (Zod on the server — pre-built)
- Build tooling / Vite config
- TypeScript type definitions (interfaces and types are pre-written; students only consume them)
- Component composition and JSX syntax (assumed baseline knowledge, not a graded item)
