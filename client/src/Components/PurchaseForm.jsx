import TicketCard from "./TicketCard";

export default function PurchaseForm({ ticketTypes, onPurchaseSuccess, isPastEvent }) {
  return (
    <div className="purchase-form">
      <h3>Select Tickets</h3>
      {isPastEvent ? (
        <p className="message error">This event has already passed.</p>
      ) : !ticketTypes || ticketTypes.length === 0 ? (
        <p>No tickets available for this event.</p>
      ) : (
        <div className="tickets-grid">
          {ticketTypes.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onPurchaseSuccess={onPurchaseSuccess}
              isPastEvent={isPastEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
}