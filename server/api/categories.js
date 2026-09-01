import express from "express";
import requireBody from "../middleware/requireBody.js";
const router = express.Router();
export default router;

import { getCategories } from "../db/queries/categories.js";

router.get("/", async (req, res, next) => {
  try {
    const categories = await getCategories();
    res.send(categories);
  } catch (error) {
    next(error);
  }
});
