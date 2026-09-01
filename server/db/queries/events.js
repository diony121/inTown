import client from "../client.js";

export async function getEvents() {
  const result = await client.query(`
    SELECT 
      events.*,
      locations.name AS location_name,
      locations.city,
      locations.state,
      COALESCE(
        json_agg(categories.name) FILTER (WHERE categories.id IS NOT NULL),
        '[]'
      ) AS categories
    FROM events
    JOIN locations ON events.location_id = locations.id
    LEFT JOIN event_categories ON event_categories.event_id = events.id
    LEFT JOIN categories ON categories.id = event_categories.category_id
    GROUP BY events.id, locations.id
    ORDER BY events.event_date, events.event_time;
  `);

  return result.rows;
}

export async function getEventById(id) {
  const result = await client.query(
    `
      SELECT
        events.*,
        locations.name AS location_name,
        locations.address,
        locations.city,
        locations.state,
        locations.zip
      FROM events
      JOIN locations ON events.location_id = locations.id
      WHERE events.id = $1;
    `,
    [id],
  );

  return result.rows[0];
}

export async function getTicketTypesByEventId(eventId) {
  const result = await client.query(
    `
      SELECT id, name, price, quantity
      FROM ticket_types
      WHERE event_id = $1
      ORDER BY price;
    `,
    [eventId],
  );

  return result.rows;
}

export async function createEvent(
  title,
  description,
  eventDate,
  eventTime,
  locationId,
  imageUrl,
  organizerId,
  isFree,
) {
  const result = await client.query(
    `
      INSERT INTO events (
        title,
        description,
        event_date,
        event_time,
        location_id,
        image_url,
        organizer_id,
        is_free
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `,
    [
      title,
      description,
      eventDate,
      eventTime,
      locationId,
      imageUrl,
      organizerId,
      isFree,
    ],
  );

  return result.rows[0];
}

export async function addEventCategory(eventId, categoryId) {
  await client.query(
    `
      INSERT INTO event_categories (
        event_id,
        category_id
      )
      VALUES ($1, $2);
    `,
    [eventId, categoryId],
  );
}

export async function createTicketType(eventId, name, price, quantity) {
  const result = await client.query(
    `
      INSERT INTO ticket_types (
        event_id,
        name,
        price,
        quantity
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
    [eventId, name, price, quantity],
  );

  return result.rows[0];
}

export async function updateEvent(
  id,
  title,
  description,
  eventDate,
  eventTime,
  locationId,
  imageUrl,
  isFree,
) {
  const result = await client.query(
    `
      UPDATE events
      SET
        title = $1,
        description = $2,
        event_date = $3,
        event_time = $4,
        location_id = $5,
        image_url = $6,
        is_free = $7
      WHERE id = $8
      RETURNING *;
    `,
    [
      title,
      description,
      eventDate,
      eventTime,
      locationId,
      imageUrl,
      isFree,
      id,
    ],
  );

  return result.rows[0];
}

export async function deleteEvent(id) {
  const result = await client.query(
    `
      DELETE FROM events
      WHERE id = $1
      RETURNING *;
    `,
    [id],
  );

  return result.rows[0];
}

export async function getEventsByOrganizerId(organizerId) {
  const result = await client.query(
    `
      SELECT
        events.*,
        locations.name AS location_name,
        locations.city,
        locations.state
      FROM events
      JOIN locations
        ON events.location_id = locations.id
      WHERE events.organizer_id = $1
      ORDER BY events.event_date, events.event_time;
    `,
    [organizerId],
  );

  return result.rows;
}

export async function rescheduleEvent(
  id,
  newDate,
  newTime,
  oldDate,
  oldTime,
) {
  const result = await client.query(
    `
      UPDATE events
      SET
        previous_event_date = $1,
        previous_event_time = $2,
        event_date = $3,
        event_time = $4,
        is_rescheduled = TRUE
      WHERE id = $5
      RETURNING *;
    `,
    [
      oldDate,
      oldTime,
      newDate,
      newTime,
      id,
    ],
  );

  return result.rows[0];
}