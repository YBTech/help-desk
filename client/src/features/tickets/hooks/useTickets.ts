import { useState, useEffect } from 'react';
import { ticketApi } from '../api/ticketApi';
import type { Ticket } from '../types/ticket.types';

interface UseTicketsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  assigneeId?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface UseTicketsResult {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  } | null;
  refetch: () => void;
}

export function useTickets(params: UseTicketsParams): UseTicketsResult {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await ticketApi.getAll(params);
        setTickets(response.data.data);
        setPagination(response.data.pagination);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [JSON.stringify(params), refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return { tickets, loading, error, pagination, refetch };
}
