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
router.put("/update/basics/:movie_id", allowRole("admin"), updateMovieBasics);

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

router.delete("/delete/:_id", allowRole("admin"), deleteMovie);
router.put("/update", allowRole("admin"), upload.single("file"), updateMovie);
export default router;
