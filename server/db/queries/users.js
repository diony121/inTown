import client from "../client.js";
import bcrypt from "bcrypt";

export async function createUser(name, last_name, email, password) {
  const createUserQuery = `
    INSERT INTO users(name, last_name, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
  // Encrypting password when inserting into database
  const hashPassword = await bcrypt.hash(password, 15);
  const {
    rows: [user],
  } = await client.query(createUserQuery, [
    name,
    last_name,
    email,
    hashPassword,
  ]);
  return user;
}

export async function getUser(email, password) {
  const getUserQuery = `
    SELECT * 
    FROM users
    WHERE email = $1
    `;
  const {
    rows: [user],
  } = await client.query(getUserQuery, [email]);
  // Credentials checking
  if (!user) {
    return null;
  }
  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    return null;
  }
  return user;
}

export async function getUserById(userId) {
  const getUserIdQuery = `
    SELECT * 
    FROM users
    WHERE id = $1
    `;
  const {
    rows: [user],
  } = await client.query(getUserIdQuery, [userId]);
  return user;
}
