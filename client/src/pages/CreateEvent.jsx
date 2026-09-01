import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { createEvent } from "../api/events";
import { createLocation } from "../api/locations";
import EventForm from "../Components/EventForm";

export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleCreateEvent(eventData, locationData) {
    try {
      const location = await createLocation(
        locationData,
        user.token,
      );

      const newEventData = {
        ...eventData,
        location_id: location.id,
      };

      const newEvent = await createEvent(
        newEventData,
        user.token,
      );

      console.log("Event created:", newEvent);

      navigate("/");
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  }

  return (
    <div className="event-page">
      <h1>Create Event</h1>

      <EventForm onSubmit={handleCreateEvent} />
    </div>
  );
}