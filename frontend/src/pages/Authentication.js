import { redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

// Action for login/signup
export async function action({ request }) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw new Response(JSON.stringify({ message: "Unsupported mode" }), {
      status: 400,
    });
  }

  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch(`https://events-management-xi.vercel.app/auth/${mode}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    // Return errors to the form
    return response;
  }

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Could not authenticate user" }), {
      status: 500,
    });
  }

  const resData = await response.json();
  const token = resData.token;

  localStorage.setItem("token", token);

  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1); // token valid for 1 hour
  localStorage.setItem("expiration", expiration.toISOString());

  return redirect("/"); // redirect after login/signup
}