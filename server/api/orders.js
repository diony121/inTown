import express from "express";
import {
  purchaseTicket,
  getOrdersByUser,
  getOrderById,
  updateOrder,
} from "../db/queries/orders.js";
import getUserFromToken from "../middleware/getUserFromToken.js";
import requireBody from "../middleware/requireBody.js";

const router = express.Router();
export default router;

router.use(getUserFromToken);

router.post(
  "/",
  requireBody(["ticket_type_id", "quantity"]),
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "You must be logged in.",
        });
      }

      const { ticket_type_id, quantity } = req.body;

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          error: "Quantity must be a positive integer.",
        });
      }

      const order = await purchaseTicket(req.user.id, ticket_type_id, quantity);

      res.status(201).json(order);
    } catch (error) {
      if (error.message === "Not enough tickets available") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Ticket type not found") {
        return res.status(400).json({ error: error.message });
      }
      next(error);
    }
  },
);

router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "You must be logged in.",
      });
    }

    const orders = await getOrdersByUser(req.user.id);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "You must be logged in.",
      });
    }

    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId < 1) {
      return res.status(400).json({
        error: "Order id must be a positive number.",
      });
    }

    const order = await getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    if (order.user_id !== req.user.id) {
      return res.status(403).json({
        error: "You are not authorized to view this order.",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", getUserFromToken, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "You must be logged in.",
      });
    }
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        error: "Order id must be a positive number.",
      });
    }
    const order = await getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    if (order.user_id !== req.user.id) {
      return res.status(403).json({
        error: "You are not allowed to delete this order.",
      });
    }
    const {
      user_id,
      event_id,
      ticket_types_id,
      quantity,
      total_price,
      order_status,
      created_at,
    } = req.body;

    const updatedOrder = await updateOrder(
      id,
      user_id ?? order.user_id,
      event_id ?? order.event_id,
      ticket_types_id ?? order.ticket_types_id,
      quantity ?? order.quantity,
      total_price ?? order.total_price,
      order_status ?? order.order_status,
      created_at ?? order.created_at,
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
});
