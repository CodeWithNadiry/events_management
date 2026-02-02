// import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';

import classes from './EventsList.module.css';

function EventsList({events}) {
  // const events = useLoaderData();

  return (
    <div className={classes.events}>
      <h1>All Events</h1>
      <ul className={classes.list}>
        {events && events.length > 0 ? events.map((event) => (
          <li key={event._id} className={classes.item}>
            <Link to={`/events/${event._id}`}>
              <img src={`https://events-management-xi.vercel.app${event.image}`} alt={event.title} />
              <div className={classes.content}>
                <h2>{event.title}</h2>
                <time>{event.date}</time>
              </div>
            </Link>
          </li>
        )): <p>No Events yet.</p>}
      </ul>
    </div>
  );
}

export default EventsList;
