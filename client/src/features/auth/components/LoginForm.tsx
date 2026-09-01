import styles from "./LoginForm.module.css";

export function LoginForm() {
  // 🔴 Todo: implement login logic.
  // 1. handle the form submission and validation logic. 
  //    - username: admin, alice, bob, carol, or dave
  //    - password: 123
  // 2. call the login API and handle the response. api: http://localhost:4000/api/users/login
  // 3. display error message if login fails.
  // 4. on successful login, update the auth context with user information and close the dropdown.

  return (
    <>
      <form>
        <div className={styles.field}>
          <label className={styles.label}>Username</label>
          <input type="text" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input type="password" className={styles.input} />
        </div>
        {/* <div className={styles.error}>Wrong username or password</div> */}
        <button type="submit" className={styles.submit}>
          Login
        </button>
      </form>
      <div className={styles.hint}>
        <p>Try: admin, alice, bob, carol, or dave</p>
        <p>Password: 123</p>
      </div>
    </>
  );
}
