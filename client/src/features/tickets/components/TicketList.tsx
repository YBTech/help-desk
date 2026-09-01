import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTickets } from "../hooks/useTickets";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { TicketCard } from "./TicketCard";
import { TicketFilter } from "./TicketFilter";
import styles from "./TicketList.module.css";

export function TicketList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  // Todo 🔴: use "useDebouncedValue" hook to debounce the search input
  // expected behavior:
  // the search input should not trigger a new fetch on every keystroke, but only after the user has stopped typing for a short period of time (e.g., 300ms)

  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";
  const category = searchParams.get("category") || "";
  const assigneeId = searchParams.get("assigneeId") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  // fully implemented custom hook for data fetching
  const { tickets, loading, error, pagination } = useTickets({
    page,
    limit: 10,
    search,
    status,
    priority,
    category,
    assigneeId,
    sortBy,
    sortOrder,
  });

  // fully implemented useEffect to sync state with URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (category) params.category = category;
    if (assigneeId) params.assigneeId = assigneeId;
    if (sortBy !== "createdAt") params.sortBy = sortBy;
    if (sortOrder !== "desc") params.sortOrder = sortOrder;
    if (page !== 1) params.page = page.toString();
    setSearchParams(params);
  }, [search, status, priority, category, assigneeId, sortBy, sortOrder, page]);

  // fully implemented function to update URL params
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      // fully implemented logic for deleting empty params
      params.delete(key);
    }
    // fully implemented logic for reset page on filter change
    params.set("page", "1");
    setSearchParams(params);
  };

  // fully implemented pagination handler
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Tickets</h1>
        <Link to="/tickets/new" className={styles.createButton}>
          {/* fully implemented Link for navigation */}
          Create Ticket
        </Link>
      </div>

      <TicketFilter
        search={search}
        onSearchChange={setSearch}
        status={status}
        priority={priority}
        category={category}
        assigneeId={assigneeId}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onFilterChange={handleFilterChange}
      />

      {/* Todo 🔴: implement loading and error handling */}
      <div className={styles.ticketGrid}>
        {/* 🔴 TODO: if tickets is empty show "No tickets found", otherwise render the list of tickets using TicketCard component */}
        <TicketCard
          ticket={{
            id: 1,
            title: "title",
            description: "description",
            status: "open",
            priority: "urgent",
            category: "bug",
            reporterName: "reporter name",
            reporterEmail: "reporter email",
            assigneeId: null,
            slaDeadline: new Date(
              Date.now() + 2 * 60 * 60 * 1000,
            ).toISOString(),
            resolvedAt: null,
            closedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
        />
      </div>

      {/* Fully implemented pagination logics */}
      {pagination && pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={styles.pageButton}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pagination.totalPages}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
