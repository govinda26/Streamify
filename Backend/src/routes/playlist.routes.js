import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  getCurrentUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create").post(createPlaylist);
router.route("/add-video").post(addVideoToPlaylist);
router.route("/remove-video").post(removeVideoFromPlaylist);
router.route("/user").get(getCurrentUserPlaylists);

router.route("/channel/:userId").get(getUserPlaylists);

router
  .route("/:playlistId")
  .delete(deletePlaylist)
  .patch(updatePlaylist);

router.route("/:playlistId/details").get(getPlaylistById);

export default router;
