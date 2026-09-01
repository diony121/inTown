import db from "../client.js";

export async function getTicketTypes(eventId) {
  const sql = `
    SELECT id, name, price, quantity
    FROM ticket_types
    WHERE event_id = $1
    ORDER BY price;
    `;
  const result = await db.query(sql, [eventId]);
  return result.rows;
}
export async function updateTicketType(id, name, price, quantity) {
  const sql = `
    UPDATE ticket_types
    SET
      name = $1,
      price = $2,
      quantity = $3
    WHERE id = $4
    RETURNING *;
  `;

  const result = await db.query(sql, [
    name,
    price,
    quantity,
    id,
  ]);

  return result.rows[0];
}