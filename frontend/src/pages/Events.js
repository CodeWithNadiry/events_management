import { useLoaderData } from 'react-router-dom';

import EventsList from '../components/EventsList';

function EventsPage() {
  const events = useLoaderData();
  return <EventsList events={events} />;
}

export default EventsPage;


export async function loader() {
  const response = await fetch(
    'https://events-management-xi.vercel.app/events'
  );

  if (!response.ok) {
    throw new Error('Could not fetch events.');
  }

  const data = await response.json();
  return data.events;
}
