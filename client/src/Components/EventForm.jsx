import { useState } from "react";

export default function EventForm({
  onSubmit,
  initialData = {},
  buttonText = "Create Event",
}) {
  const [isFree, setIsFree] = useState(initialData.is_free ?? null);

  const [ticketTypes, setTicketTypes] = useState(
    initialData.ticket_types?.length > 0
      ? initialData.ticket_types
      : [
          {
            name: "",
            price: "",
            quantity: "",
          },
        ],
  );

  function addTicketType() {
    setTicketTypes([
      ...ticketTypes,
      {
        name: "",
        price: "",
        quantity: "",
      },
    ]);
  }

  function removeTicketType(index) {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  }

  function handleTicketChange(index, field, value) {
    const updatedTickets = [...ticketTypes];

    updatedTickets[index] = {
      ...updatedTickets[index],
      [field]: value,
    };

    setTicketTypes(updatedTickets);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const eventData = {
      title: formData.get("title"),
      description: formData.get("description"),
      event_date: formData.get("event_date"),
      event_time: formData.get("event_time"),
      image_url: formData.get("image_url") || null,
      is_free: isFree,
    };

    if (isFree === false) {
      eventData.ticket_types = ticketTypes.map((ticket) => ({
      id: ticket.id,
      name: ticket.name,
      price: Number(ticket.price),
      quantity: Number(ticket.quantity),
    }));
    }

    const locationData = {
      name: formData.get("address"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
    };

    onSubmit(eventData, locationData);
  }

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          defaultValue={initialData.title || ""}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData.description || ""}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="event_date">Event Date</label>
          <input
            id="event_date"
            type="date"
            name="event_date"
            defaultValue={
              initialData.event_date
                ? initialData.event_date.slice(0, 10)
                : ""
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="event_time">Event Time</label>
          <input
            id="event_time"
            type="time"
            name="event_time"
            defaultValue={
              initialData.event_time
                ? initialData.event_time.slice(0, 5)
                : ""
            }
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          name="address"
          defaultValue={initialData.address || ""}
          required
        />
      </div>

      <div className="location-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            name="city"
            defaultValue={initialData.city || ""}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            id="state"
            type="text"
            name="state"
            defaultValue={initialData.state || ""}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="zip">ZIP Code</label>
          <input
            id="zip"
            type="text"
            name="zip"
            defaultValue={initialData.zip || ""}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="image_url">Image URL</label>
        <input
          id="image_url"
          type="text"
          name="image_url"
          defaultValue={initialData.image_url || ""}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="event-type-section">
        <p>Event Type</p>

        <div className="event-type-options">
          <label className="event-type-choice">
            <input
              type="radio"
              name="event_type"
              value="free"
              checked={isFree === true}
              onChange={() => setIsFree(true)}
              required
            />
            <span>Free Event</span>
          </label>

          <label className="event-type-choice">
            <input
              type="radio"
              name="event_type"
              value="paid"
              checked={isFree === false}
              onChange={() => setIsFree(false)}
              required
            />
            <span>Paid Event</span>
          </label>
        </div>
      </div>

      {isFree === false && (
        <div className="ticket-section">
          <div className="ticket-section-header">
            <div>
              <h3>Ticket Information</h3>
              <p>Add the ticket options available for this event.</p>
            </div>

            <button
              className="add-ticket-btn"
              type="button"
              onClick={addTicketType}
            >
              + Add Ticket
            </button>
          </div>

          {ticketTypes.map((ticket, index) => (
            <div className="ticket-form-card" key={index}>
              <div className="ticket-card-header">
                <h4>Ticket Type {index + 1}</h4>

                {ticketTypes.length > 1 && (
                  <button
                    className="remove-ticket-btn"
                    type="button"
                    onClick={() => removeTicketType(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="ticket-input-row">
                <div className="form-group">
                  <label>Ticket Name</label>
                  <input
                    type="text"
                    value={ticket.name}
                    onChange={(event) =>
                      handleTicketChange(
                        index,
                        "name",
                        event.target.value,
                      )
                    }
                    placeholder="General Admission"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={ticket.price}
                    onChange={(event) =>
                      handleTicketChange(
                        index,
                        "price",
                        event.target.value,
                      )
                    }
                    min="0"
                    step="0.01"
                    placeholder="20.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={ticket.quantity}
                    onChange={(event) =>
                      handleTicketChange(
                        index,
                        "quantity",
                        event.target.value,
                      )
                    }
                    min="0"
                    step="1"
                    placeholder="100"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="event-submit-btn" type="submit">
        {buttonText}
      </button>
    </form>
  );
}