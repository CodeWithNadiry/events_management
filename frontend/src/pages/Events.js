import EventsList from '../components/EventsList';

const events = [
    {
      "_id": "698083d5ab35002185eafef5",
      "title": "wedding",
      "description": "bestjflkjs;dlkf;jalskdfjl;asdkfjsadfj",
      "image": "https://res.cloudinary.com/djvjx5sxa/image/upload/v1770030037/events/yumqewykbswqxaovi2ca.jpg",
      "date": "2008-03-01T00:00:00.000Z",
      "createdAt": "2026-02-02T11:00:37.716Z",
      "updatedAt": "2026-02-02T11:00:37.716Z",
      "__v": 0
    }
  ]
function EventsPage() {
  return <EventsList events={events} />;
}

export default EventsPage;