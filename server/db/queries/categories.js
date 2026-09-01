import db from "../client.js";

export async function getCategories() {
  const sql = `
    SELECT * 
    FROM categories
    ORDER BY name
    `;
  const { rows } = await db.query(sql);
  return rows;
}
