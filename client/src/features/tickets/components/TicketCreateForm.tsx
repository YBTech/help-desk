import { useNavigate } from 'react-router-dom';
import styles from './TicketForm.module.css';
import { useEffect, useState } from 'react';
import type { TicketCategory, TicketPriority, User } from '../types/ticket.types';
import type { ApiResponse } from '../../../shared/types/api.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface FormErrors {
  title?: string;
  description?: string;
  reporterName?: string;
  reporterEmail?: string;
  submit?: string;
}

export function TicketCreateForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<TicketPriority>("medium");
  const [category, setCategory] =
    useState<TicketCategory>("bug");
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchUsers() {
      setUsersLoading(true);
      try {
        const response = await fetch(`${API_URL}/users`);
        const data: ApiResponse<User[]> = await response.json();
        if (!cancelled) {
          setUsers(data.data);
        }
      } catch (err: any) {
        if(!cancelled) {
          setErrors(prev => ({ ...prev, submit: err.message || "Failed to fetch users" }));
        }
      } finally {
        if(!cancelled) {
          setUsersLoading(false);
        }
      }
    }
    fetchUsers();
    return () => {
      cancelled = true;
    }
  }, []);

  // 🔴 TODO:
  // 1. set up controlled component state for: title, description, priority, category,
  //    reporterName, reporterEmail, assigneeId
  // 2. fetch users from GET /api/users on mount (for the assignee dropdown)
  // 3. implement client-side validation:
  //    - title: min 5 characters
  //    - description, reporterName: required
  //    - reporterEmail: required + valid email format
  //    display inline error messages under each field when invalid
  // 4. on submit, POST to /api/tickets with the form data,
  //    then navigate to /tickets/:id using the returned ticket id
  // 5. track a "submitting" state — disable the submit button and show "Saving..." while the request is in flight

  function validateForm(): boolean {
    const newErrors: FormErrors = {};
    if(title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }
    if(description.trim() === "") {
      newErrors.description = "Description is required";
    }
    if(reporterName.trim() === "") {
      newErrors.reporterName = "Reporter name is required";
    }
    if(reporterEmail.trim() === "") {
      newErrors.reporterEmail = "Reporter email is required";
    } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporterEmail)) {
      newErrors.reporterEmail = "Reporter email must be a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if(!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setErrors(prev => ({ ...prev, submit: undefined }));
      const response = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          category,
          reporterName,
          reporterEmail,
          assigneeId: assigneeId || null,
        }),
      });
      const data: ApiResponse<{ id: string }> = await response.json();
      if(!response.ok) {
        throw new Error(data.message || "Failed to create ticket");
      }
      navigate(`/tickets/${data.data.id}`);
    } catch (err: any) {
      setErrors(prev => ({ ...prev, submit: err.message || "Failed to create ticket" }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Create Ticket</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        {errors.submit && <div className={styles.submitError} role="alert">{errors.submit}</div>}
        <div className={styles.field}>
          <label htmlFor="title">Title *</label>
          <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} aria-invalid={!!errors.title} />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description *</label>
          <textarea id="description" rows={6} value={description} onChange={e => setDescription(e.target.value)} aria-invalid={!!errors.description} />
          {errors.description && <span className={styles.error}>{errors.description}</span>}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="priority">Priority *</label>
            <select id="priority" value={priority} onChange={e => setPriority(e.target.value as TicketPriority)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="category">Category *</label>
            <select id="category" value={category} onChange={e => setCategory(e.target.value as TicketCategory)}>
              <option value="bug">Bug</option>
              <option value="feature_request">Feature Request</option>
              <option value="question">Question</option>
              <option value="account_issue">Account Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="reporterName">Reporter Name *</label>
            <input id="reporterName" type="text" value={reporterName} onChange={e => setReporterName(e.target.value)} aria-invalid={!!errors.reporterName} />
            {errors.reporterName && <span className={styles.error}>{errors.reporterName}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="reporterEmail">Reporter Email *</label>
            <input id="reporterEmail" type="email" value={reporterEmail} onChange={e => setReporterEmail(e.target.value)} aria-invalid={!!errors.reporterEmail} />
            {errors.reporterEmail && <span className={styles.error}>{errors.reporterEmail}</span>}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="assigneeId">Assignee</label>
          <select id="assigneeId" value={assigneeId} onChange={e => setAssigneeId(e.target.value)} disabled={usersLoading}>
            <option value="">{usersLoading ? "Loading..." : "Select Assignee"}</option>
            {/* render one <option> per user from the fetched users list */}
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.displayName} ({user.username})</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="assigneeId">Assignee</label>
          <select id="assigneeId" value={assigneeId} onChange={e => setAssigneeId(e.target.value)} disabled={usersLoading}>
            <option value="">{usersLoading ? "Loading..." : "Select Assignee"}</option>
            {/* render one <option> per user from the fetched users list */}
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.displayName} ({user.username})</option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton} disabled={submitting}>
            {submitting ? "Creating..." : "Create Ticket"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.cancelButton}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
