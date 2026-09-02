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
  const debouncedSearch = useDebouncedValue(search, 300);

  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";
  const category = searchParams.get("category") || "";
  const assigneeId = searchParams.get("assigneeId") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const { tickets, loading, error, pagination } = useTickets({
    page,
    limit: 10,
    search: debouncedSearch,
    status,
    priority,
    category,
    assigneeId,
    sortBy,
    sortOrder,
  });

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

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

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

      <div className={styles.ticketGrid}>
        {loading && <LoadingSpinner />}
        {!loading && error && <div className={styles.error}>{error}</div>}
        {!loading && !error && tickets.length === 0 && (
          <div className={styles.empty}>No tickets found</div>
        )}
        {!loading && !error && tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)}
      </div>

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
