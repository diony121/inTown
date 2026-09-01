import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/orders";
import { Link } from "react-router";

export default function TicketCard({ ticket, onPurchaseSuccess, isPastEvent }) {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const maxAvailable = ticket.quantity ?? 99;

  const handleBuy = async () => {
    if (isPastEvent) {
      setMessage({ type: "error", text: "This event has already passed." });
      return;
    }
    if (!isLoggedIn) {
      setMessage({
        type: "error",
        text: "You must be logged in to buy tickets.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const order = await createOrder(ticket.id, quantity);
      setMessage({ type: "success", text: `Order #${order.id} confirmed!` });
      setQuantity(1);
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Purchase failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-card">
      <h4>{ticket.name}</h4>
      <p className="ticket-price">${Number(ticket.price).toFixed(2)}</p>
      <p className="ticket-stock">
        {ticket.quantity === null
          ? "Unlimited available"
          : `${ticket.quantity} left`}
      </p>

      <div className="quantity-row">
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={!isLoggedIn || loading || isPastEvent}
        >
          -
        </button>
        <span className="quantity-value">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity(Math.min(maxAvailable, quantity + 1))}
          disabled={!isLoggedIn || loading || isPastEvent}
        >
          +
        </button>
      </div>

      <button
        className="buy-btn"
        onClick={handleBuy}
        disabled={
          !isLoggedIn ||
          loading ||
          isPastEvent ||
          (ticket.quantity !== null && ticket.quantity === 0)
        }
      >
        {isPastEvent
          ? "Event Passed"
          : !isLoggedIn
            ? "Log in to buy"
            : loading
              ? "Processing…"
              : ticket.quantity === 0
                ? "Sold Out"
                : "Buy"}
      </button>

      {!isLoggedIn && (
        <p className="message error">
          Please <Link to="/login">log in</Link> to purchase tickets.
        </p>
      )}

      {isPastEvent && (
        <p className="message error">This event has already passed.</p>
      )}

      {message.text && (
        <p className={`message ${message.type}`}>{message.text}</p>
      )}
    </div>
  );
}
