import {
  Form,
  useNavigate,
  useNavigation,
  useActionData,
  redirect,
} from "react-router-dom";

import classes from "./EventForm.module.css";
import getAuthToken from "../util/Auth";

function EventForm({ method, event }) {
  const data = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  function cancelHandler() {
    navigate("..");
  }

  return (
    <Form
      method={method}
      className={classes.form}
      encType="multipart/form-data"
    >
      {data && data.errors && (
        <ul>
          {Object.values(data.errors).map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
      <p>
        <label htmlFor="title">Title</label>
        <input id="title" type="text" name="title" required defaultValue={event && event.title } />
      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input id="image" type="file" name="image" required  />
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <input id="date" type="date" name="date" required defaultValue={event && event.date } />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="5" required defaultValue={event && event.description } />
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler} disabled={isSubmitting}>
          Cancel
        </button>
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save"}
        </button>
      </div>
    </Form>
  );
}

export default EventForm;

export async function action({ request, params }) {
  const method = request.method;
  const formData = await request.formData(); // FormData object

  let url = "https://events-management-xi.vercel.app//events";
  if (method === "PATCH") {
    url = `https://events-management-xi.vercel.app//events/${params.eventId}`;
  }

  const token = getAuthToken();
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: "Bearer " + token, // only auth header
    },
    body: formData, // send FormData directly
  });

  if (response.status === 422) {
    const data = await response.json();
    return data;
  }

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Could not save event." }), { status: 500 });
  }

  return redirect("/events");
}
