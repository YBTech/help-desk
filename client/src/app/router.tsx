import { createBrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { NotFound } from '../shared/components/NotFound';
import { Dashboard } from '../features/dashboard/components/Dashboard';
import { TicketList } from '../features/tickets/components/TicketList';
import { TicketDetail } from '../features/tickets/components/TicketDetail';
import { TicketCreateForm } from '../features/tickets/components/TicketCreateForm';
import { ApiDocs } from '../docs/ApiDocs';
import { UserList } from '../features/users/components/UserList';
import { Layout } from './Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary><NotFound /></ErrorBoundary>,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'tickets',
        element: <TicketList />,
      },
      {
        path: 'tickets/new',
        element: <TicketCreateForm />,
      },
      {
        path: 'tickets/:id',
        element: <TicketDetail />,
      },
      {
        path: 'users',
        element: <UserList />,
      },
      {
        path: 'docs/api',
        element: <ApiDocs />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
