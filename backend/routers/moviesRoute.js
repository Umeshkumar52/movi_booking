import express from "express";
import upload from "../middilwares/multer.js";
import {
  getMovies,
  create,
  deleteMovie,
  updateMovie,
  searchMovi,
  bookeMovi,
  moviDetails,
  updateMovieTrailer,
  updateMovieMedia,
  updateMovieBasics,
  updateActor,
  updateCrew,
  addNewActor,
  addNewCrew,
  getActor,
  getcrew,
  deleteActor,
  deleteCrew,
  addSeason,
  updateSeason,
  deleteSeason,
  addEpisode,
  updateEpisode,
  deleteEpisode,
  getSeriesDetails,
  getSeasonDetails,
} from "../controllers/moviController.js";
import allowRole from "../middilwares/allowRole.js";

const router = express.Router();
router.get("/:page/:limit", getMovies);
router.get("/search", searchMovi);
router.put("/book", bookeMovi);
router.get("/details", moviDetails);

router.post(
  "/create",
  allowRole("admin"),
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "media", maxCount: 1 },
    { name: "trailerPoster", maxCount: 1 },
    { name: "trailerMedia", maxCount: 1 },
  ]),
  create,
);

router.get("/actor/get/:movie_id", getActor);
router.get("/crew/getdata/:movie_id", getcrew);

router.patch(
  "/update/trailer/:movie_id",
  allowRole("admin"),
  upload.fields([
    { name: "trailerPoster", maxCount: 1 },
    { name: "trailerMedia", maxCount: 1 },
  ]),
  updateMovieTrailer,
);

router.patch(
  "/update/media/:movie_id",
  allowRole("admin"),
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "media", maxCount: 1 },
  ]),
  updateMovieMedia,
);
router.put(
  "/update/basics/:movie_id",
  allowRole("admin"),
  upload.single("poster"),
  updateMovieBasics,
);

router.put(
  "/actor/update",
  allowRole("admin"),
  upload.single("avatar"),
  updateActor,
);
router.put(
  "/crew/update",
  allowRole("admin"),
  upload.single("avatar"),
  updateCrew,
);
router.post(
  "/actor/add",
  allowRole("admin"),
  upload.single("avatar"),
  addNewActor,
);
router.post(
  "/crew/add",
  allowRole("admin"),
  upload.single("avatar"),
  addNewCrew,
);
router.delete("/delete/:_id", allowRole("admin"), deleteMovie);
router.delete("/actor/delete/:_id", allowRole("admin"), deleteActor);
router.delete("/crew/delete/:_id", allowRole("admin"), deleteCrew);
router.put("/update", allowRole("admin"), upload.single("file"), updateMovie);

// Season & Episode Routes
router.get("/series/details/:seriesId", allowRole("admin"), getSeriesDetails);
router.get("/season/details/:seasonId", allowRole("admin"), getSeasonDetails);
router.post(
  "/season/add",
  allowRole("admin"),
  upload.single("banner"),
  addSeason,
);
router.put(
  "/season/update",
  allowRole("admin"),
  upload.single("banner"),
  updateSeason,
);

router.post(
  "/episode/add",
  allowRole("admin"),
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  addEpisode,
);

router.put(
  "/episode/update",
  allowRole("admin"),
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  updateEpisode,
);

router.delete("/season/delete", allowRole("admin"), deleteSeason);
router.delete("/episode/delete/:_id", allowRole("admin"), deleteEpisode);

export default router;
