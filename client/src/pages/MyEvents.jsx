import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getEvents } from "../api/events";
import EventCard from "../Components/EventCard";

export default function MyEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadMyEvents() {
      try {
        const allEvents = await getEvents();
        const myEvents = allEvents.filter(
          (event) => Number(event.organizer_id) === Number(user.id)
        );
        setEvents(myEvents);
      } catch (error) {
        console.error("Failed to load my events:", error);
      }
    }

    if (user?.id) {
      loadMyEvents();
    }
  }, [user?.id]);

  if (!user) {
    return <p>Please log in to see your events.</p>;
  }

  return (
    <div className="my-events-page">
      <h2>My Events</h2>

      <Link to="/events/create">
        <button>+ Create New Event</button>
      </Link>

      {events.length === 0 ? (
        <p>You have not created any events yet.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} className="my-event-item">
            <hr className="event-divider" />
            <EventCard event={event} />
            <Link to={`/events/${event.id}/manage`}>
              <button>⛯ Manage Event</button>
            </Link>
          </div>
        ))
      )}
    </div>
  );
}