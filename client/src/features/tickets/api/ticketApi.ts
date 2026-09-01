import axios from 'axios';
import type { Ticket } from '../types/ticket.types';
import type { PaginatedResponse, ApiResponse } from '../../../shared/types/api.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const ticketApi = {
  getAll: (params: Record<string, any>) => {
    return axios.get<PaginatedResponse<Ticket>>(`${API_URL}/tickets`, { params });
  },

  getById: (id: number) => {
    return axios.get<ApiResponse<Ticket>>(`${API_URL}/tickets/${id}`);
  },

  create: (data: any) => {
    return axios.post<ApiResponse<Ticket>>(`${API_URL}/tickets`, data);
  },

  update: (id: number, data: any) => {
    return axios.put<ApiResponse<Ticket>>(`${API_URL}/tickets/${id}`, data);
  },

  updateStatus: (id: number, status: string) => {
    return axios.patch<ApiResponse<Ticket>>(`${API_URL}/tickets/${id}/status`, { status });
  },

  delete: (id: number) => {
    return axios.delete<ApiResponse<void>>(`${API_URL}/tickets/${id}`);
  },
};
