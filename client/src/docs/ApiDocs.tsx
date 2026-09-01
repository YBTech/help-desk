import { useState } from 'react';
import styles from './ApiDocs.module.css';

const BASE = 'http://localhost:4000/api';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface Field {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
}

interface Endpoint {
  method: Method;
  path: string;
  summary: string;
  queryParams?: Field[];
  requestBody?: { fields: Field[]; example: object };
  response: { description: string; example: object };
}

interface Group {
  tag: string;
  base: string;
  endpoints: Endpoint[];
}

const groups: Group[] = [
  {
    tag: 'Stats',
    base: `${BASE}/stats`,
    endpoints: [
      {
        method: 'GET',
        path: '/api/stats',
        summary: 'Get dashboard statistics',
        response: {
          description: 'Ticket counts grouped by status and priority, plus SLA info.',
          example: {
            success: true,
            data: {
              totalTickets: 42,
              openTickets: 12,
              avgResolutionTimeSeconds: 14400,
              slaBreachCount: 3,
              statusCounts: { open: 12, in_progress: 8, resolved: 15, closed: 7 },
              priorityCounts: { low: 10, medium: 18, high: 9, urgent: 5 },
            },
          },
        },
      },
      {
        method: 'GET',
        path: '/api/stats/recent',
        summary: 'Get the 5 most recently created tickets',
        response: {
          description: 'Array of the 5 most recent tickets with assignee info.',
          example: {
            success: true,
            data: [
              {
                id: 7,
                title: 'Login page returns 500 error',
                status: 'open',
                priority: 'urgent',
                category: 'bug',
                createdAt: '2026-06-17T10:00:00.000Z',
              },
            ],
          },
        },
      },
    ],
  },
  {
    tag: 'Tickets',
    base: `${BASE}/tickets`,
    endpoints: [
      {
        method: 'GET',
        path: '/api/tickets',
        summary: 'List tickets with filtering, sorting, and pagination',
        queryParams: [
          { name: 'page', type: 'number', description: 'Page number (default: 1)' },
          { name: 'limit', type: 'number', description: 'Results per page (default: 10)' },
          { name: 'search', type: 'string', description: 'Search in title and description' },
          { name: 'status', type: "'open' | 'in_progress' | 'resolved' | 'closed'" },
          { name: 'priority', type: "'low' | 'medium' | 'high' | 'urgent'" },
          { name: 'category', type: "'bug' | 'feature_request' | 'question' | 'account_issue' | 'other'" },
          { name: 'assigneeId', type: 'number' },
          { name: 'sortBy', type: "'createdAt' | 'updatedAt' | 'priority' | 'slaDeadline'", description: 'Default: createdAt' },
          { name: 'sortOrder', type: "'asc' | 'desc'", description: 'Default: desc' },
        ],
        response: {
          description: 'Paginated list of tickets with assignee info.',
          example: {
            success: true,
            data: [
              {
                id: 1,
                title: 'Login page returns 500 error',
                description: 'Users are unable to log in.',
                status: 'open',
                priority: 'urgent',
                category: 'bug',
                reporterName: 'John Doe',
                reporterEmail: 'john@example.com',
                assigneeId: null,
                assignee: null,
                slaDeadline: '2026-06-17T14:00:00.000Z',
                resolvedAt: null,
                closedAt: null,
                createdAt: '2026-06-17T10:00:00.000Z',
                updatedAt: '2026-06-17T10:00:00.000Z',
              },
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 42,
              totalPages: 5,
            },
          },
        },
      },
      {
        method: 'GET',
        path: '/api/tickets/:id',
        summary: 'Get a single ticket by ID',
        response: {
          description: 'Single ticket object with nested assignee.',
          example: {
            success: true,
            data: {
              id: 1,
              title: 'Login page returns 500 error',
              description: 'Users are unable to log in.',
              status: 'open',
              priority: 'urgent',
              category: 'bug',
              reporterName: 'John Doe',
              reporterEmail: 'john@example.com',
              assigneeId: 2,
              assignee: { id: 2, username: 'alice', displayName: 'Alice Johnson', email: 'alice@helpdesk.com', role: 'agent' },
              slaDeadline: '2026-06-17T14:00:00.000Z',
              resolvedAt: null,
              closedAt: null,
              createdAt: '2026-06-17T10:00:00.000Z',
              updatedAt: '2026-06-17T10:00:00.000Z',
            },
          },
        },
      },
      {
        method: 'POST',
        path: '/api/tickets',
        summary: 'Create a new ticket',
        requestBody: {
          fields: [
            { name: 'title', type: 'string', required: true, description: 'Min 5 characters' },
            { name: 'description', type: 'string', required: true },
            { name: 'priority', type: "'low' | 'medium' | 'high' | 'urgent'", required: true },
            { name: 'category', type: "'bug' | 'feature_request' | 'question' | 'account_issue' | 'other'", required: true },
            { name: 'reporterName', type: 'string', required: true },
            { name: 'reporterEmail', type: 'string', required: true, description: 'Valid email' },
            { name: 'assigneeId', type: 'number | null', required: false },
          ],
          example: {
            title: 'Login page returns 500 error',
            description: 'Users are unable to log in due to a server error.',
            priority: 'urgent',
            category: 'bug',
            reporterName: 'John Doe',
            reporterEmail: 'john@example.com',
            assigneeId: null,
          },
        },
        response: {
          description: 'The newly created ticket. SLA deadline is auto-calculated from priority.',
          example: {
            success: true,
            data: {
              id: 43,
              title: 'Login page returns 500 error',
              status: 'open',
              priority: 'urgent',
              slaDeadline: '2026-06-17T14:00:00.000Z',
              createdAt: '2026-06-17T10:00:00.000Z',
            },
          },
        },
      },
      {
        method: 'PATCH',
        path: '/api/tickets/:id/status',
        summary: 'Update ticket status',
        requestBody: {
          fields: [
            { name: 'status', type: "'open' | 'in_progress' | 'resolved' | 'closed'", required: true, description: 'Must follow valid transition' },
          ],
          example: { status: 'in_progress' },
        },
        response: {
          description: 'Updated ticket. Valid transitions: open→in_progress→resolved→closed. Reopen: any→open.',
          example: { success: true, data: { id: 1, status: 'in_progress', updatedAt: '2026-06-17T11:00:00.000Z' } },
        },
      },
      {
        method: 'DELETE',
        path: '/api/tickets/:id',
        summary: 'Delete a ticket',
        response: {
          description: '204 No Content on success.',
          example: {},
        },
      },
    ],
  },
  {
    tag: 'Users',
    base: `${BASE}/users`,
    endpoints: [
      {
        method: 'GET',
        path: '/api/users',
        summary: 'List all users',
        response: {
          description: 'Array of all user accounts.',
          example: {
            success: true,
            data: [
              { id: 1, username: 'admin', displayName: 'Admin User', email: 'admin@helpdesk.com', role: 'admin', createdAt: '2026-06-01T00:00:00.000Z' },
              { id: 2, username: 'alice', displayName: 'Alice Johnson', email: 'alice@helpdesk.com', role: 'agent', createdAt: '2026-06-01T00:00:00.000Z' },
            ],
          },
        },
      },
      {
        method: 'GET',
        path: '/api/users/:id',
        summary: 'Get a single user by ID',
        response: {
          description: 'Single user object.',
          example: {
            success: true,
            data: { id: 2, username: 'alice', displayName: 'Alice Johnson', email: 'alice@helpdesk.com', role: 'agent', createdAt: '2026-06-01T00:00:00.000Z' },
          },
        },
      },
      {
        method: 'POST',
        path: '/api/users/login',
        summary: 'Log in as a user',
        requestBody: {
          fields: [
            { name: 'username', type: 'string', required: true, description: "'admin' | 'alice' | 'bob' | 'carol' | 'dave'" },
          ],
          example: { username: 'alice' },
        },
        response: {
          description: 'User object on success. No password required — username only.',
          example: {
            success: true,
            data: { id: 2, username: 'alice', displayName: 'Alice Johnson', email: 'alice@helpdesk.com', role: 'agent' },
          },
        },
      },
    ],
  },
];

const METHOD_COLOR: Record<Method, string> = {
  GET: styles.methodGet,
  POST: styles.methodPost,
  PUT: styles.methodPut,
  PATCH: styles.methodPatch,
  DELETE: styles.methodDelete,
};

function EndpointCard({ ep }: { ep: Endpoint }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.card}>
      <button className={styles.cardHeader} onClick={() => setOpen(o => !o)}>
        <span className={`${styles.method} ${METHOD_COLOR[ep.method]}`}>{ep.method}</span>
        <span className={styles.path}>{ep.path}</span>
        <span className={styles.summary}>{ep.summary}</span>
        <span className={styles.chevron}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className={styles.cardBody}>
          {ep.queryParams && (
            <section>
              <h4 className={styles.sectionTitle}>Query Parameters</h4>
              <table className={styles.table}>
                <thead>
                  <tr><th>Name</th><th>Type</th><th>Notes</th></tr>
                </thead>
                <tbody>
                  {ep.queryParams.map(p => (
                    <tr key={p.name}>
                      <td><code>{p.name}</code></td>
                      <td><code className={styles.type}>{p.type}</code></td>
                      <td className={styles.desc}>{p.description ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {ep.requestBody && (
            <section>
              <h4 className={styles.sectionTitle}>Request Body <span className={styles.contentType}>application/json</span></h4>
              <table className={styles.table}>
                <thead>
                  <tr><th>Field</th><th>Type</th><th>Required</th><th>Notes</th></tr>
                </thead>
                <tbody>
                  {ep.requestBody.fields.map(f => (
                    <tr key={f.name}>
                      <td><code>{f.name}</code></td>
                      <td><code className={styles.type}>{f.type}</code></td>
                      <td>{f.required ? <span className={styles.required}>yes</span> : <span className={styles.optional}>no</span>}</td>
                      <td className={styles.desc}>{f.description ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4 className={styles.sectionTitle}>Example</h4>
              <pre className={styles.code}>{JSON.stringify(ep.requestBody.example, null, 2)}</pre>
            </section>
          )}

          <section>
            <h4 className={styles.sectionTitle}>Response</h4>
            <p className={styles.desc}>{ep.response.description}</p>
            {Object.keys(ep.response.example).length > 0 && (
              <pre className={styles.code}>{JSON.stringify(ep.response.example, null, 2)}</pre>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export function ApiDocs() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>API Reference</h1>
        <p>Base URL: <code className={styles.baseUrl}>http://localhost:4000/api</code></p>
      </div>

      {groups.map(group => (
        <section key={group.tag} className={styles.group}>
          <h2 className={styles.groupTitle}>{group.tag}</h2>
          {group.endpoints.map(ep => (
            <EndpointCard key={`${ep.method}-${ep.path}`} ep={ep} />
          ))}
        </section>
      ))}
    </div>
  );
}
