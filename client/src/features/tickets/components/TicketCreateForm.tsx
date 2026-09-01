import { useNavigate } from 'react-router-dom';
import styles from './TicketForm.module.css';

export function TicketCreateForm() {
  const navigate = useNavigate();

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

  return (
    <div className={styles.container}>
      <h1>Create Ticket</h1>

      <form className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title">Title *</label>
          <input id="title" type="text" />
          {/* render error message here */}
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description *</label>
          <textarea id="description" rows={6} />
          {/* render error message here */}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="priority">Priority *</label>
            <select id="priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="category">Category *</label>
            <select id="category">
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
            <input id="reporterName" type="text" />
            {/* render error message here */}
          </div>

          <div className={styles.field}>
            <label htmlFor="reporterEmail">Reporter Email *</label>
            <input id="reporterEmail" type="email" />
            {/* render error message here */}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="assigneeId">Assignee</label>
          <select id="assigneeId">
            <option value="">Unassigned</option>
            {/* render one <option> per user from the fetched users list */}
          </select>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton}>
            Create Ticket
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
