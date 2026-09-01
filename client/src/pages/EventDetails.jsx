import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getEventById, getTicketTypes } from "../api/events";
import { useAuth } from "../context/AuthContext";
import PurchaseForm from "../Components/PurchaseForm";
import defaultImage from "../assets/defaultEventImage.png";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [eventData, ticketData] = await Promise.all([
          getEventById(id),
          getTicketTypes(id),
        ]);
        setEvent(eventData);
        setTicketTypes(ticketData);
      } catch (err) {
        setError("Failed to load event details.");
        console.error(err);
      }
    }
    loadData();
  }, [id]);

  const refreshTicketTypes = async () => {
    try {
      const data = await getTicketTypes(id);
      setTicketTypes(data);
    } catch (err) {
      console.error("Failed to refresh ticket types:", err);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!event) return <p>Loading...</p>;

  const eventDateTime = new Date(`${event.event_date}T${event.event_time}`);
  const isPastEvent = eventDateTime < new Date();

  const formattedTime = new Date(
    `1970-01-01T${event.event_time}`,
  ).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
  <div className="event-details-page">
    <section className="event-section">
      <div className="event-image-wrapper">
        <img
          className="eventImage"
          src={event.image_url || defaultImage}
          alt={event.title}
        />
      </div>

      <div className="event-info">
        <h1>{event.title}</h1>
        <p><strong>Hosted at:</strong> {event.location_name}</p>
        <p><strong>Address:</strong> {event.address} {event.city}, {event.state} {event.zip}</p>
        <p><strong>Date & Time:</strong> {formattedDate} at {formattedTime}</p>

        {event.is_rescheduled && (
          <div className="rescheduled-notice">
            <h3>⚠ Event Rescheduled</h3>
            <p>
              Previous date:{" "}
              {new Date(event.previous_event_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>
              Previous time:{" "}
              {new Date(`1970-01-01T${event.previous_event_time}`).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            <p>New date: {formattedDate}</p>
            <p>New time: {formattedTime}</p>
          </div>
        )}

        <p className="event-description">{event.description}</p>
        <p className={event.is_free ? "free-event" : "paid-event"}>
          {event.is_free ? "Free Event" : "Paid Event"}
        </p>
      </div>
    </section>

    <PurchaseForm
      ticketTypes={ticketTypes}
      onPurchaseSuccess={refreshTicketTypes}
      isPastEvent={isPastEvent}
    />
  </div>
);
}
