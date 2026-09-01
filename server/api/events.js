import express from "express";
import {
  getEvents,
  getEventById,
  getEventsByOrganizerId,
  getTicketTypesByEventId,
  createEvent,
  addEventCategory,
  createTicketType,
  updateEvent,
  deleteEvent,
  rescheduleEvent,
} from "../db/queries/events.js";

import getUserFromToken from "../middleware/getUserFromToken.js";
import requireBody from "../middleware/requireBody.js";
import { updateTicketType } from "../db/queries/ticketTypes.js";

const router = express.Router();

function isWithin24Hours(event) {
  const eventStart = new Date(
    `${event.event_date.toISOString().slice(0, 10)}T${event.event_time}`,
  );

  const now = new Date();

  const hoursUntilEvent =
    (eventStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    console.log("Event date:", event.event_date);
    console.log("Event time:", event.event_time);
    console.log("Event start:", eventStart);
    console.log("Current time:", now);
    console.log("Hours until event:", hoursUntilEvent);

  return hoursUntilEvent <= 24;
}

// GET /events
router.get("/", async (req, res, next) => {
  try {
    const events = await getEvents();

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
});

// POST /events
router.post(
  "/",
  getUserFromToken,
  requireBody([
    "title",
    "description",
    "event_date",
    "event_time",
    "location_id",
    "is_free",
  ]),
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "You must be logged in.",
        });
      }

      const {
        title,
        description,
        event_date,
        event_time,
        location_id,
        image_url,
        is_free,
        category_ids,
        ticket_types,
      } = req.body;

      const event = await createEvent(
        title,
        description,
        event_date,
        event_time,
        location_id,
        image_url ?? null,
        req.user.id,
        is_free,
      );

      if (Array.isArray(category_ids)) {
        for (const categoryId of category_ids) {
          await addEventCategory(event.id, categoryId);
        }
      }

      if (Array.isArray(ticket_types)) {
        for (const ticketType of ticket_types) {
          await createTicketType(
            event.id,
            ticketType.name,
            ticketType.price,
            ticketType.quantity ?? null,
          );
        }
      }

      const createdEvent = {
        ...event,
        categories: category_ids ?? [],
        ticket_types: ticket_types ?? [],
      };

      res.status(201).json(createdEvent);
    } catch (error) {
      next(error);
    }
  },
);

// GET /events/:eventId/ticket-types
router.get("/:eventId/ticket-types", async (req, res, next) => {
  try {
    const eventId = Number(req.params.eventId);

    if (!Number.isInteger(eventId) || eventId < 1) {
      return res.status(400).json({
        error: "Event id must be a positive number.",
      });
    }

    const event = await getEventById(eventId);

    if (!event) {
      return res.status(404).json({
        error: "Event not found.",
      });
    }

    const ticketTypes = await getTicketTypesByEventId(eventId);

    res.status(200).json(ticketTypes);
  } catch (error) {
    next(error);
  }
});

// GET /events/my
router.get("/my", getUserFromToken, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "You must be logged in.",
      });
    }

    const events = await getEventsByOrganizerId(req.user.id);

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
});

// PUT /events/:id/reschedule
router.put(
  "/:id/reschedule",
  getUserFromToken,
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "You must be logged in.",
        });
      }

      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
          error: "Event id must be a positive number.",
        });
      }

      const event = await getEventById(id);

      if (!event) {
        return res.status(404).json({
          error: "Event not found.",
        });
      }

      if (event.organizer_id !== req.user.id) {
        return res.status(403).json({
          error: "You are not allowed to reschedule this event.",
        });
      }

      if (isWithin24Hours(event)) {
        return res.status(403).json({
          error:
            "This event cannot be rescheduled within 24 hours of the start time.",
        });
      }


      const { event_date, event_time } = req.body;

      if (!event_date || !event_time) {
        return res.status(400).json({
          error: "New date and time are required.",
        });
      }

      const updatedEvent = await rescheduleEvent(
        id,
        event_date,
        event_time,
        event.event_date,
        event.event_time,
      );

      res.status(200).json(updatedEvent);
    } catch (error) {
      next(error);
    }
  },
);

// PUT /events/:id
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
        error: "Event id must be a positive number.",
      });
    }

    const event = await getEventById(id);

    if (!event) {
      return res.status(404).json({
        error: "Event not found.",
      });
    }

    if (event.organizer_id !== req.user.id) {
      return res.status(403).json({
        error: "You are not allowed to update this event.",
      });
    }

    if (isWithin24Hours(event)) {
      return res.status(403).json({
        error: "This event cannot be changed within 24 hours of the start time.",
      });
    }

    const {
      title,
      description,
      event_date,
      event_time,
      location_id,
      image_url,
      is_free,
      ticket_types,
    } = req.body;

    const updatedEvent = await updateEvent(
      id,
      title ?? event.title,
      description ?? event.description,
      event_date ?? event.event_date,
      event_time ?? event.event_time,
      location_id ?? event.location_id,
      image_url !== undefined ? image_url : event.image_url,
      is_free ?? event.is_free,
    );

    if (Array.isArray(ticket_types)) {
      for (const ticket of ticket_types) {
        if (ticket.id) {
          await updateTicketType(
            ticket.id,
            ticket.name,
            ticket.price,
            ticket.quantity,
          );
        } else {
          await createTicketType(
            id,
            ticket.name,
            ticket.price,
            ticket.quantity,
          );
        }
      }
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
});

//
router.delete("/:id", getUserFromToken, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "You must be logged in.",
      });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        error: "Event id must be a positive number.",
      });
    }

    const event = await getEventById(id);

    if (!event) {
      return res.status(404).json({
        error: "Event not found.",
      });
    }

    if (event.organizer_id !== req.user.id) {
      return res.status(403).json({
        error: "You are not allowed to delete this event.",
      });
    }

    if (isWithin24Hours(event)) {
      return res.status(403).json({
        error: "This event cannot be deleted within 24 hours of the start time.",
      });
    }

    await deleteEvent(id);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// GET /events/:id
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        error: "Event id must be a positive number.",
      });
    }

    const event = await getEventById(id);

    if (!event) {
      return res.status(404).json({
        error: "Event not found.",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
});

export default router;
