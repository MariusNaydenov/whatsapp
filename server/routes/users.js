import express from "express";
import { findUser, getUsers } from "../controllers/users.js";

const router = express.Router();

router.get("/all-users", getUsers);
router.get("/:selectedPersonId", findUser);

export default router;
