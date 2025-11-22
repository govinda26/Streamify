import { Router } from "express";
import { getUserChannelProfileById } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:channelId").get(verifyJWT, getUserChannelProfileById);

export default router;
