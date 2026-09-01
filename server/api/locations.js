import express from "express";
import requireBody from "../middleware/requireBody.js";
const router = express.Router();
export default router;

import { getAllLocations, getLocationById, createLocation } from "../db/queries/locations.js";


router.get("/", async (req, res, next) => {
  try {
    const locations = await getAllLocations();
    res.send(locations);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const location = await getLocationById(req.params.id);
    if (!location) return res.status(404).send("Location not found");
    res.send(location);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  requireBody(["name", "city", "state", "zip"]),
  async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).send("Unauthorized");

      const { name, address, city, state, zip } = req.body;
      const location = await createLocation({ name, address, city, state, zip });
      res.status(201).send(location);
    } catch (err) {
      next(err);
    }
  }
);


