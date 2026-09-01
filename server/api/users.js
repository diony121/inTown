import express from "express";
const usersRouter = express.Router();
export default usersRouter;

import { createUser, getUser, getUserById } from "../db/queries/users.js";
import { createToken } from "../utils/jwt.js";
import requireBody from "../middleware/requireBody.js";

usersRouter.post(
  "/register",
  requireBody(["name", "last_name", "email", "password"]),
  async (req, res) => {
    const { name, last_name, email, password } = req.body;
    const user = await createUser(name, last_name, email, password);
    const token = createToken({ id: user.id });
    res.status(201).send(token);
  },
);

usersRouter.post(
  "/login",
  requireBody(["email", "password"]),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await getUser(email, password);
    if (!user) {
      return res.status(401).send("Invalid email/password.");
    }
    const token = createToken({ id: user.id });
    res.send(token);
  },
);

usersRouter.get("/me", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    res.send(req.user);
  } catch (err) {
    next(err);
  }
});
