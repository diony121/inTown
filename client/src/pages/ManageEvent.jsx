import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getEventById,
  deleteEvent,
  rescheduleEvent,
} from "../api/events";

export default function ManageEvent() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (error) {
        console.error("Failed to load event:", error);
      }
    }

    loadEvent();
  }, [id]);

  async function handleReschedule(e) {
    e.preventDefault();

    try {
      await rescheduleEvent(
        id,
        {
          event_date: newDate,
          event_time: newTime,
        },
        user.token,
      );

      navigate(`/events/${id}`);
    } catch (error) {
        const message =
        error.response?.data?.error || "Failed to reschedule event.";

        alert(message);

        console.error("Failed to reschedule event:", error);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteEvent(id, user.token);
      navigate("/my-events");
    } catch (error) {
        const message =
        error.response?.data?.error || "Failed to delete event.";

        alert(message);

        console.error("Failed to delete event:", error);
    }
  }

  if (!event) {
    return <p>Loading event...</p>;
  }

  if (!user || Number(event.organizer_id) !== Number(user.id)) {
    return <p>You are not allowed to manage this event.</p>;
  }

  return (
    <div className="manage-event-page">
      <div className="manage-event-container">
        <div className="manage-event-header">
          <h2>Manage Event</h2>
          <p>{event.title}</p>
        </div>

        <div className="manage-card">
          <h3>Edit Event</h3>
          <p>Update the event details, location, or ticket information.</p>

          <Link to={`/events/${id}/edit`}>
            <button className="manage-edit-btn">
              Edit Event
            </button>
          </Link>
        </div>

        <div className="manage-card">
          <h3>Reschedule Event</h3>
          <p>Change the event date and time.</p>

          <form
            className="reschedule-form"
            onSubmit={handleReschedule}
          >
            <div className="reschedule-row">
              <label>
                New Date
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </label>

              <label>
                New Time
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                />
              </label>
            </div>

            <button className="manage-reschedule-btn" type="submit">
              Reschedule Event
            </button>
          </form>
        </div>

        <div className="manage-card delete-card">
          <h3>Delete Event</h3>
          <p>
            Permanently delete this event. This action cannot be undone.
          </p>

          <button
            className="manage-delete-btn"
            onClick={handleDelete}
          >
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
}