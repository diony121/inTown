import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getMyOrders, deleteOrder } from "../api/orders";
import { useAuth } from "../context/AuthContext";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const updateMessage = async () => {
    setMessage({ type: "", text: "" });
  };

  useEffect(() => {
    if (!user) return;

    async function fetchOrders() {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError("Failed to load orders.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  const handleRefund = async (orderId) => {
    try {
      await deleteOrder(orderId);
      const data = await getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return <p>Please log in to see your orders.</p>;
  if (loading) return <p>Loading orders…</p>;
  if (error) return <p className="error">{error}</p>;
  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div className="orders-page">
      <h2>{user.name} Orders</h2>
      <p>User ID: {user.id}</p>
      <p>Email: {user.email}</p>
      <ul className="order-list">
        {orders
          .sort((a, b) => a.id - b.id)
          .map((order) => (
            <li key={order.id} className="order-item">
              <Link to={`/events/${order.event_id}`}>
                <strong
                  className={
                    order.order_status === "refunded"
                      ? "refunded"
                      : "eventTitle"
                  }
                >
                  {order.event_title} - {order.ticket_type_name}
                </strong>
              </Link>
              <p>
                Quantity: {order.quantity} | Total: ${order.total_price}
              </p>
              <p>
                Status: {order.order_status} | Ordered:{" "}
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p>Order ID: {order.id}</p>
              <button
                onClick={() => handleRefund(order.id)}
                disabled={order.order_status === "refunded"}
              >
                Refund order
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
