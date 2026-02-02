import { Suspense } from 'react';
import { useLoaderData, Await, defer } from 'react-router-dom';

import EventsList from '../components/EventsList';

function EventsPage() {
  const { events } = useLoaderData();

  return (
    <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
      <Await resolve={events}>
        {(loadedEvents) => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
  );
}

export default EventsPage;

async function loadEvents() {
  const response = await fetch(
    'https://events-management-xi.vercel.app/events'
  );

  if (!response.ok) {
    throw new Response(
      JSON.stringify({ message: 'Could not fetch events.' }),
      { status: 500 }
    );
  }

  const resData = await response.json();
  return resData.events;
}

export function loader() {
  return defer({
    events: loadEvents(),
  });
}