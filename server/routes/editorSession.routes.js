import express from "express";
import {
  startEditorSession,
  updateSessionStatus,
  markAiUsed,
} from "../controllers/editorSession.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/start", isAuthenticated, startEditorSession);
router.patch("/status", isAuthenticated, updateSessionStatus);
router.patch("/ai", isAuthenticated, markAiUsed);

export default router;
