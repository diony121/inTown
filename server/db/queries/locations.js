import db from "../client.js";

export async function getAllLocations() {
  const sql = `SELECT *
   FROM locations
    ORDER BY name
   `;
  const { rows } = await db.query(sql);
  return rows;
}

export async function getLocationById(id) {
  const sql = `SELECT * FROM locations WHERE id = $1`;
  const { rows: [location] } = await db.query(sql, [id]);
  return location;
}

export async function createLocation({ name, address, city, state, zip }) {
  const sql = `
    INSERT INTO locations (name, address, city, state, zip)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const { rows: [location] } = await db.query(sql, [name, address, city, state, zip]);
  return location;
}