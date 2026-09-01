import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { createLocation } from "../api/locations";
import EventForm from "../Components/EventForm";
import { getEventById, getTicketTypes, updateEvent } from "../api/events";

export default function EditEvent() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        const eventData = await getEventById(id);
        const ticketData = await getTicketTypes(id);

        setEvent({
          ...eventData,
          ticket_types: ticketData,
        });
      } catch (error) {
        console.error("Failed to load event:", error);
      }
    }

    loadEvent();
  }, [id]);

  async function handleUpdateEvent(eventData, locationData) {
    try {
      const location = await createLocation(
        locationData,
        user.token,
      );

      const updatedEventData = {
        ...eventData,
        location_id: location.id,
      };

      const updatedEvent = await updateEvent(
        id,
        updatedEventData,
        user.token,
      );

      console.log("Event updated:", updatedEvent);

      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.error || "Failed to update event.";

      alert(message);

      console.error("Failed to update event:", error);
    }
  }

  if (!event) {
    return <p>Loading event...</p>;
  }

  return (
    <div className="event-page">
      <h1>Edit Event</h1>

      <EventForm
        onSubmit={handleUpdateEvent}
        initialData={event}
        buttonText="Update Event"
      />
    </div>
  );
}