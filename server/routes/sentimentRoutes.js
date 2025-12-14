import express from "express";
import { analyzeSentiment } from "../controller/sentimentController.js";

const router = express.Router();

router.post("/analyze", analyzeSentiment);

export default router;
