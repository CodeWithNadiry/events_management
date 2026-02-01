import { Form, Link, useActionData, useNavigation, useSearchParams } from "react-router-dom";
import classes from "./AuthForm.module.css";

function AuthForm() {
  const data = useActionData(); // errors or messages from action
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode") || "login"; // default to login
  const isLogin = mode === "login";

  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post" className={classes.form}>
      <h1>{isLogin ? "Log in" : "Create a new user"}</h1>

      {/* Display field errors */}
      {data && data.errors && (
        <ul className={classes.errors}>
          {Object.values(data.errors).map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      )}

      {/* Display general message */}
      {data && data.message && <p className={classes.message}>{data.message}</p>}

      {/* Email input */}
      <p>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" required />
      </p>

      {/* Password input */}
      <p>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" required />
      </p>

      {/* Actions */}
      <div className={classes.actions}>
        <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
          {isLogin ? "Create new user" : "Login"}
        </Link>
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save"}
        </button>
      </div>
    </Form>
  );
}

export default AuthForm;