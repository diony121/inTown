import { Link } from "react-router";
import defaultImage from "../assets/defaultEventImage.png";

export default function EventCard({ event }) {
  const imageSrc = event.image_url || defaultImage;

  const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
};

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(`1970-01-01T${event.event_time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="event-card">
      <Link to={`/events/${event.id}`} aria-label={`View details for ${event.title}`}>
        <img src={imageSrc} alt={event.title} />
      </Link>
      <div className="event-card-body">
      <h2 className="event-card-title">
        <Link to={`/events/${event.id}`}>{event.title}</Link>
      </h2>
      <p>{truncateText(event.description, 200)}</p>
      <p>Date: {formattedDate}</p>
      <p>Location: {event.location_name}, {event.city}</p>
      <p>Time: {formattedTime}</p>
      {event.is_free ? <p className="event-status free">Free Event</p> : <p className="event-status paid">Paid Event</p>}
    </div>
    </div>
  );
}