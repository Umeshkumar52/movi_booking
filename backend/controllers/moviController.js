import { notificationEvent } from "../methods/notificationEvent.js";
import actorSchema from "../models/moviModals/actorSchema.js";
import crewSchema from "../models/moviModals/crewSchema.js";
import movies from "../models/moviModals/movieSchema.js";
import seatsSchema from "../models/seatsSchema.js";
import { uploadToCloudinary } from "../methods/uploadToCloudinary.js";
import seasonSchema from "../models/moviModals/sessionSchema.js";
import episodeSchema from "../models/moviModals/episodSchema.js";
import { createOrder } from "./notificationController.js";
import sessionSchema from "../models/moviModals/sessionSchema.js";
import Show from "../models/moviModals/showSchema.js";
import Booking from "../models/moviModals/bookingSchema.js";
import Theater from "../models/moviModals/theatorSchema.js";
import mongoose from "mongoose";
import bookingSchema from "../models/moviModals/bookingSchema.js";
import user from "../models/auth.js";
import jwt from "jsonwebtoken";
// User Controller
export const getMovies = async (req, res) => {
  try {
    const page = Number(req.params.page || req.query.page) || 1;
    const limit = Number(req.params.limit || req.query.limit) || 10;
    const skipPage = (page - 1) * limit;
   const{role,_id}=req.user
   if(role==="subAdmin"){
      const response = await movies
      .find({assignSubAdmin:_id})
      .sort({ createdAt: -1, _id: -1 }) // Deterministic sorting
      .skip(skipPage)
      .limit(limit)
      .lean();
      const documents = await movies.countDocuments({assignSubAdmin:_id});
     return res.status(200).json({
      message: { data: response, documents },
    });
   }
    const response = await movies
      .find()
      .sort({ createdAt: -1, _id: -1 }) // Deterministic sorting
      .skip(skipPage)
      .limit(limit)
      .lean();
    const documents = await movies.countDocuments();

    return res.status(200).json({
      message: { data: response, documents },
    });

  } catch (err) {
    console.error("Get Movies Error:", err);
    return res.status(500).json({
      message: "Something went wrong !",
    });
  }
};

export const getActor = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const response = await actorSchema.find({ movie_id });
    return res.status(200).json({
      message: response,
    });
  } catch (err) {
    return res.status(301).json({
      message: "Something went wrong !",
    });
  }
};

export const getcrew = async (req, res) => {
  try {
    const { movie_id } = req.params;

    const response = await crewSchema.find({ movie_id });
    return res.status(200).json({
      message: response,
    });
  } catch (err) {
    console.log(err);
    return res.status(301).json({
      message: "Something went wrong?",
    });
  }
};

export const moviDetails = async (req, res) => {
  try {
    const { role } = req.user;
    const { _id } = req.query;
    const currentMovie = await movies.findById(_id);
    const relatedMovies = await movies
      .find({
        _id: { $ne: _id },
        status: "active",
        Category: currentMovie.Category,
        $or: [
          { genres: { $regex: currentMovie.genres, $options: "i" } },
          { actores: { $in: currentMovie.actores } },
        ],
      })
      .sort({ rating: -1 })
      .limit(15);

    return res.status(200).json({
      message: { currentMovie, relatedMovies },
    });
  } catch (err) {
    return res.status(401).json({
      message: "Something went wrong to load !",
    });
  }
};

export const bookeMovi = async (req, res) => {
  try {
    const { seats } = req.body;
    const { _id } = req.user;
    const { movi_id, rpi } = req.query;

    if (!movi_id || !_id) {
      return res.status(301).json({ message: "all details not provided" });
    }

    function parseSeat(seatNumber) {
      const row = seatNumber.match(/[A-Z]+/i)[0];
      const col = parseInt(seatNumber.match(/\d+/)[0]);
      return { row, col };
    }

    const bulkOps = seats.map((item) => {
      const { row, col } = parseSeat(item);
      return {
        updateOne: {
          filter: {
            movi_id,
            // seatNumber: item,
            row,
            col,
            isBooked: false,
          },
          update: {
            $set: {
              isBooked: true,
              bookedBy: _id,
              razorpay_payment_id: rpi,
            },
          },
        },
      };
    });

    // send notification to user that seats are booked
    await notificationEvent(
      "Booking confirmed",
      "your seats has been booked successfully",
      _id,
    );

    const result = await seatsSchema.bulkWrite(bulkOps);

    res.status(200).json({
      message: "updated successfully",
      result,
    });
  } catch (err) {
    console.log(err);
    return res.status(301).json({
      message: "something went wrong",
    });
  }
};

export const userAssignToMovie=async(req,res)=>{
  try {
      const{_id,user_id}=req.body
      await movies.updateOne({_id},{
        $push:{assignSubAdmin:user_id}
      })
       return res.status(200).json({
      message:"Assigned Successfully",
    });
  } catch (error) {
     return res.status(301).json({
      message: "something went wrong",
    });
  }
}
export const unAssignToMovie=async(req,res)=>{
  try {
      const{_id,user_id}=req.query
      await movies.updateOne({_id},{
        $pull:{assignSubAdmin:user_id}
      })
       return res.status(200).json({
      message:"unAssigned Successfully",
    });
  } catch (error) {
     return res.status(301).json({
      message: "something went wrong",
    });
  }
}
// Admin Controller

export const create = async (req, res) => {
  try {
    const {
      premium,
      price,
      year,
      rating,
      totalSeasons,
      totalEpisodes,
      isCompleted,
      duration,
      Category,
    } = req.body;

    let poster = "";
    let media = "";
    let trailerPoster = "";
    let trailerMedia = "";

    if (req.files) {
      const posterPath = req.files.poster?.[0]?.path;
      const mediaPath = req.files.media?.[0]?.path;
      const trailerPosterPath = req.files.trailerPoster?.[0]?.path;
      const trailerMediaPath = req.files.trailerMedia?.[0]?.path;

      // Upload available files to Cloudinary
      const uploads = await Promise.all([
        posterPath
          ? uploadToCloudinary(posterPath, "movies/posters")
          : Promise.resolve(""),
        mediaPath
          ? uploadToCloudinary(mediaPath, "movies/media")
          : Promise.resolve(""),
        trailerPosterPath
          ? uploadToCloudinary(trailerPosterPath, "movies/trailers/posters")
          : Promise.resolve(""),
        trailerMediaPath
          ? uploadToCloudinary(trailerMediaPath, "movies/trailers/media")
          : Promise.resolve(""),
      ]);

      [poster, media, trailerPoster, trailerMedia] = uploads;
    }

    // Prepare data with proper type casting and strict separation
    const contentData = {
      main_title: req.body.main_title,
      title: req.body.title,
      Category: req.body.Category,
      year: year ? Number(year) : undefined,
      releaseDate: req.body.releaseDate,
      rating: rating ? Number(rating) : undefined,
      language: req.body.language,
      genres: req.body.genres,
      storyline: req.body.storyline,
      poster: poster || req.body.poster,
      premium: premium === "true" || premium === true,
      price: price ? Number(price) : 0,
    };

    // Category specific fields
    if (Category === "movie") {
      contentData.duration = duration ? Number(duration) : undefined;
      contentData.media = media || req.body.media;
      contentData.trailer = {
        poster: trailerPoster,
        media: trailerMedia,
      };
    } else if (Category === "series") {
      contentData.totalSeasons = totalSeasons ? Number(totalSeasons) : 0;
      contentData.totalEpisodes = totalEpisodes ? Number(totalEpisodes) : 0;
      contentData.isCompleted = isCompleted === "true" || isCompleted === true;
    }

    const response = await movies.create(contentData);

    return res.status(200).json({
      message: response,
    });
  } catch (err) {
    console.error("Create Content Error:", err);
    return res.status(500).json({
      message: err.message || "Something went wrong while creating content",
    });
  }
};

export const searchMovi = async (req, res) => {
  try {
    const { SearchKey, Category, status, language, genres, year, premium } =
      req.query;
   
    // Build filter conditions from query params
    const filterConditions = [];
    if (Category) filterConditions.push({ Category });
    if (status) filterConditions.push({ status });
    if (language)
      filterConditions.push({ language: { $regex: language, $options: "i" } });
    if (genres)
      filterConditions.push({ genres: { $regex: genres, $options: "i" } });
    if (year && !isNaN(year)) filterConditions.push({ year: Number(year) });
    if (premium !== undefined && premium !== "") {
      const premiumBool = JSON.parse(premium);
      filterConditions.push({ premium: premiumBool });
    }

    // Build text-search conditions
    let searchConditions = null;
    if (SearchKey) {
      const searchRegex = { $regex: SearchKey, $options: "i" };
      searchConditions = {
        $or: [
          { name: searchRegex },
          { main_title: searchRegex },
          { title: searchRegex },
          { Category: searchRegex },
          { language: searchRegex },
          { genres: searchRegex },
          { storyline: searchRegex },
        ],
      };
      // Add numeric search for year if SearchKey is a number
      if (!isNaN(SearchKey)) {
        searchConditions.$or.push({ year: Number(SearchKey) });
      }
    }

    // Combine: both, either, or all
    let query = {};
    if (searchConditions && filterConditions.length) {
      query = { $and: [searchConditions, ...filterConditions] };
    } else if (searchConditions) {
      query = searchConditions;
    } else if (filterConditions.length) {
      query = { $and: filterConditions };
    }

    const response = await movies.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      message: response,
    });
  } catch (err) {
    console.error("Search Error:", err);
    return res.status(200).json({
      message: "Something went Wrong",
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      return res.status(301).json({
        message: "Something went wrong !",
      });
    }
    const response = await movies.deleteOne({ _id });
    return res.status(200).json({
      message: "deleted successfully",
    });
  } catch (err) {
    return res.status(301).json({
      message: "Something went wrong",
    });
  }
};

export const updateMovieBasics = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const whitelist = [
      "main_title",
      "title",
      "Category",
      "status",
      "year",
      "releaseDate",
      "rating",
      "language",
      "genres",
      "storyline",
      "premium",
      "price",
      "duration",
      "isCompleted",
    ];

    const bodyData = {};
    whitelist.forEach((key) => {
      if (req.body[key] !== undefined) {
        let value = req.body[key];

        // Accurate type casting for FormData strings
        if (["year", "rating", "price", "duration"].includes(key)) {
          value = value === "" ? undefined : Number(value);
        } else if (["premium", "isCompleted"].includes(key)) {
          value = String(value) === "true";
        }

        bodyData[key] = value;
      }
    });

    // Handle poster file update individually
    if (req.file) {
      bodyData.poster = await uploadToCloudinary(
        req.file.path,
        "movies/posters",
      );
    }

    const data = await movies.findByIdAndUpdate(
      movie_id,
      {
        $set: bodyData,
      },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      message: data,
    });
  } catch (error) {
    console.error("Update Movie Basics Error:", error);
    res.status(400).json({
      message: "failed to updated",
    });
  }
};

export const updateMovieTrailer = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const bodyData = {};
    const trailerPosterPath = req.files.trailerPoster?.[0]?.path;
    const trailerMediaPath = req.files.trailerMedia?.[0]?.path;

    if (trailerPosterPath) {
      bodyData["trailer.poster"] = await uploadToCloudinary(
        trailerPosterPath,
        "movies/trailers/posters",
      );
    }
    if (trailerMediaPath) {
      bodyData["trailer.media"] = await uploadToCloudinary(
        trailerMediaPath,
        "movies/trailers/media",
      );
    }

    const data = await movies.findByIdAndUpdate(
      movie_id,
      {
        $set: bodyData,
      },
      { new: true },
    );
    res.status(200).json({
      message: {
        trailer: {
          media: bodyData["trailer.media"] ?? data.trailer.media,
          poster: bodyData["trailer.poster"] ?? data.trailer.poster,
        },
      },
    });
  } catch (error) {
    console.error("Update Movie Trailer Error:", error);
    res.status(400).json({
      message: "failed to updated",
    });
  }
};

export const updateMovieMedia = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const bodyData = {};
    const posterPath = req.files?.poster?.[0]?.path;
    const mediaPath = req.files?.media?.[0]?.path;

    if (posterPath) {
      bodyData["poster"] = await uploadToCloudinary(
        posterPath,
        "movies/posters",
      );
    }
    if (mediaPath) {
      bodyData["media"] = await uploadToCloudinary(mediaPath, "movies/media");
    }

    const data = await movies.findByIdAndUpdate(
      movie_id,
      {
        $set: bodyData,
      },
      { new: true },
    );
    res.status(200).json({
      message: {
        media: bodyData?.media ?? data.media,
        poster: bodyData?.poster ?? data.poster,
      },
    });
  } catch (error) {
    console.error("Update Movie Media Error:", error);
    res.status(400).json({
      message: "failed to updated",
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { _id } = req.query;
    if (!_id) {
      return res.status(301).json({
        message: "Something went wrong",
      });
    }
    const updates = {};
    for (let key in req.body) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (req.file) {
      updates["source_url"] = await uploadToCloudinary(
        req.file.path,
        "movies/source",
      );
    }

    const response = await movies.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      message: response,
    });
  } catch (err) {
    console.error("Update Movie Error:", err);
    return res.status(301).json({
      message: "Something went wrong",
    });
  }
};

export const addNewActor = async (req, res) => {
  try {
    let img = "";
    if (req.file) {
      img = await uploadToCloudinary(req.file.path, "actors");
    }
    const actor = await actorSchema.create({ ...req.body, img });
    res.status(200).json({
      message: actor,
    });
  } catch (error) {
    console.error("Add New Actor Error:", error);
    res.status(400).json({
      message: "failed to create actore",
    });
  }
};

export const addNewCrew = async (req, res) => {
  try {
    let img = "";
    if (req.file) {
      img = await uploadToCloudinary(req.file.path, "crew");
    }
    const data = await crewSchema.create({ ...req.body, img });
    res.status(200).json({
      message: data,
    });
  } catch (error) {
    console.error("Add New Crew Error:", error);
    res.status(400).json({
      message: "failed to create",
    });
  }
};

export const updateActor = async (req, res) => {
  try {
    const { _id } = req.query;
    let updates = { ...req.body };

    if (req.file) {
      updates.img = await uploadToCloudinary(req.file.path, "actors");
    }

    const data = await actorSchema.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true },
    );

    res.status(200).json({
      message: data,
    });
  } catch (error) {
    console.error("Update Actor Error:", error);
    res.status(400).json({
      message: "failed to updated",
    });
  }
};

export const updateCrew = async (req, res) => {
  try {
    const { _id } = req.query;
    let updates = { ...req.body };

    if (req.file) {
      updates.img = await uploadToCloudinary(req.file.path, "crew");
    }

    const data = await crewSchema.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true },
    );

    res.status(200).json({
      message: data,
    });
  } catch (error) {
    console.error("Update Crew Error:", error);
    res.status(400).json({
      message: "failed to updated",
    });
  }
};

export const deleteActor = async (req, res) => {
  try {
    const { _id } = req.params;
    await actorSchema.findByIdAndDelete(_id);
    res.status(200).json({
      message: "deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "failed to delete",
    });
  }
};

export const deleteCrew = async (req, res) => {
  try {
    const { _id } = req.params;
    await crewSchema.findByIdAndDelete(_id);
    res.status(200).json({
      message: "deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "failed to delete",
    });
  }
};

// --- Season & Episode Management ---

export const addSeason = async (req, res) => {
  try {
    const { series, seasonNumber } = req.body;
    if (!series || !seasonNumber) {
      return res
        .status(400)
        .json({ message: "Series ID and Season Number are required" });
    }

    let banner = "";
    if (req.file) {
      banner = await uploadToCloudinary(req.file.path, "seasons/banners");
    } else if (!req.body.banner) {
      return res.status(400).json({ message: "Season banner is required" });
    }

    const season = await seasonSchema.create({
      ...req.body,
      banner: banner || req.body.banner,
    });
    await movies.updateOne({ _id: series }, { $inc: { totalSeasons: 1 } });
    res.status(201).json({
      message: season,
    });
  } catch (error) {
    console.error("Add Season Error:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Season number already exists for this series" });
    }
    res.status(500).json({
      message: "Failed to add season",
    });
  }
};

export const updateSeason = async (req, res) => {
  try {
    const { _id } = req.query;
    if (!_id) {
      return res.status(400).json({ message: "Season ID is required" });
    }

    const updates = { ...req.body };
    if (req.file) {
      updates.banner = await uploadToCloudinary(
        req.file.path,
        "seasons/banners",
      );
    }

    const season = await seasonSchema.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true },
    );
    // await sessionSchema.findOne({series},{$inc:{totalEpisodes:1}})
    if (!season) {
      return res.status(404).json({ message: "Season not found" });
    }

    res.status(200).json({
      message: season,
    });
  } catch (error) {
    console.error("Update Season Error:", error);
    res.status(500).json({
      message: "Failed to update season",
    });
  }
};

export const addEpisode = async (req, res) => {
  try {
    const { series, season, episodeNumber, title, duration } = req.body;
    if (!series || !season || !episodeNumber || !title || !duration) {
      return res
        .status(400)
        .json({ message: "Missing required episode details" });
    }

    let videoUrl = "";
    let thumbnail = "";

    if (req.files) {
      const videoPath = req.files.video?.[0]?.path;
      const thumbPath = req.files.thumbnail?.[0]?.path;

      if (videoPath)
        videoUrl = await uploadToCloudinary(videoPath, "episodes/videos");
      if (thumbPath)
        thumbnail = await uploadToCloudinary(thumbPath, "episodes/thumbnails");
    }

    const episode = await episodeSchema.create({
      ...req.body,
      videoUrl,
      thumbnail,
    });
    await sessionSchema.updateOne({ series }, { $inc: { totalEpisodes: 1 } });
    await movies.updateOne({ _id: series }, { $inc: { totalEpisodes: 1 } });
    res.status(201).json({
      message: episode,
    });
  } catch (error) {
    console.error("Add Episode Error:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Episode number already exists for this season" });
    }
    res.status(500).json({
      message: "Failed to add episode",
    });
  }
};

export const getSeriesDetails = async (req, res) => {
  try {
    const { seriesId } = req.params;

    // Get series metadata
    const series = await movies.findById(seriesId);
    if (!series) {
      return res.status(404).json({ message: "Series not found" });
    }

    // Get all seasons for this series
    const seasons = await seasonSchema
      .find({ series: seriesId })
      .sort({ seasonNumber: 1 });

    return res.status(200).json({
      message: {
        series,
        seasons,
      },
    });
  } catch (error) {
    console.error("Get Series Details Error:", error);
    return res.status(500).json({
      message: "Failed to fetch series details",
    });
  }
};

export const getSeasonDetails = async (req, res) => {
  try {
    const { seasonId } = req.params;

    // Get season metadata
    const season = await seasonSchema.findById(seasonId);
    if (!season) {
      return res.status(404).json({ message: "Season not found" });
    }

    // Get all episodes for this season
    const episodes = await episodeSchema
      .find({ season: seasonId })
      .sort({ episodeNumber: 1 });

    return res.status(200).json({
      message: {
        season,
        episodes,
      },
    });
  } catch (error) {
    console.error("Get Season Details Error:", error);
    return res.status(500).json({
      message: "Failed to fetch season details",
    });
  }
};

export const updateEpisode = async (req, res) => {
  try {
    const { _id } = req.query;
    if (!_id) {
      return res.status(400).json({ message: "Episode ID is required" });
    }

    const updates = { ...req.body };

    if (req.files) {
      const videoPath = req.files.video?.[0]?.path;
      const thumbPath = req.files.thumbnail?.[0]?.path;

      if (videoPath)
        updates.videoUrl = await uploadToCloudinary(
          videoPath,
          "episodes/videos",
        );
      if (thumbPath)
        updates.thumbnail = await uploadToCloudinary(
          thumbPath,
          "episodes/thumbnails",
        );
    }

    const episode = await episodeSchema.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!episode) {
      return res.status(404).json({ message: "Episode not found" });
    }

    res.status(200).json({
      message: episode,
    });
  } catch (error) {
    console.error("Update Episode Error:", error);
    res.status(500).json({
      message: "Failed to update episode",
    });
  }
};

export const deleteSeason = async (req, res) => {
  try {
    const { _id } = req.query;
    if (!_id) {
      return res.status(400).json({ message: "Season ID is required" });
    }

    // Delete all episodes associated with this season
    await episodeSchema.deleteMany({ season: _id });

    // Delete the season
    const season = await seasonSchema.findByIdAndDelete(_id);
    await movies.updateOne(
      { _id: season.series },
      { $inc: { totalEpisodes: -season.totalEpisodes, totalSeasons: -1 } },
    );
    if (!season) {
      return res.status(404).json({ message: "Season not found" });
    }

    res.status(200).json({
      message: "Season and all associated episodes deleted successfully",
    });
  } catch (error) {
    console.error("Delete Season Error:", error);
    res.status(500).json({
      message: "Failed to delete season",
    });
  }
};

export const deleteEpisode = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!_id) {
      return res.status(400).json({ message: "Episode ID is required" });
    }

    const episode = await episodeSchema.findByIdAndDelete(_id);
    await sessionSchema.updateOne(
      { _id: episode.series },
      { $inc: { totalEpisodes: -1 } },
    );
    await movies.updateOne(
      { _id: episode.series },
      { $inc: { totalEpisodes: -1 } },
    );
    if (!episode) {
      return res.status(404).json({ message: "Episode not found" });
    }

    res.status(200).json({
      message: "Episode deleted successfully",
    });
  } catch (error) {
    console.error("Delete Episode Error:", error);
    res.status(500).json({
      message: "Failed to delete episode",
    });
  }
};

// create booking

// controllers/bookingController.js
export const createBooking = async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const { showId, seats, razorpay_payment_id } = req.body;
    const userId = req.user._id; // from auth middleware

    // 1️⃣ Find show
    const show = await Show.findById(showId);
    // .session(session);

    if (!show) {
      throw new Error("Show not found");
    }

    // 2️⃣ Check if seats already booked
    const alreadyBooked = seats.some((seat) => show.bookedSeats.includes(seat));

    if (alreadyBooked) {
      throw new Error("Some seats already booked");
    }

    // 3️⃣ Calculate total amount
    let totalAmount = 0;

    seats.forEach((seat) => {
      const row = seat.charAt(0); // A1 -> A

      // Example logic (you can improve)
      if (row === "A") {
        totalAmount += show.price.VIP;
      } else {
        totalAmount += show.price.REGULAR;
      }
    });

    // 4️⃣ Create booking
    const booking = await Booking.create({
      userId,
      showId,
      seats,
      totalAmount,
      razorpay_payment_id,
      paymentStatus: "SUCCESS",
      bookingStatus: "CONFIRMED",
    });

    // 5️⃣ Update booked seats in show
    show.bookedSeats.push(...seats);
    await show.save();

    // 6️⃣ Commit transaction
    // await session.commitTransaction();
    // session.endSession();

    res.status(201).json({
      success: true,
      message: "Booking successful",
      booking: booking[0],
    });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const buySubscription = async (req, res) => {
  try {
    const { payment } = req.body;
    if (!payment) {
      return res.status(400).json({
        mesage: "Payment details not found !",
      });
    }
    const { _id } = req.user;
    const subscriptionToken = jwt.sign(payment, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.cookie("subscriptionToken", subscriptionToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    await user.updateOne(
      { _id },
      { $set: { subscription: subscriptionToken } },
    );
    res.status(200).json({
      mesage: "Subscription purchase successfully",
    });
  } catch (error) {
    res.status(400).json({
      mesage: "Failed to purchase ",
    });
  }
};

// create theaterShow

export const createTheaterAndShow = async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const { movieId } = req.query;
    const {
      name,
      screenNumber,
      totalRows,
      seatsPerRow,
      date,
      time,
      price,
      VIP_seats,
    } = req.body;

    // 1️⃣ Generate Seat Layout
    const layout = [];

    for (let i = 0; i < totalRows; i++) {
      const rowLetter = String.fromCharCode(65 + i);

      for (let j = 1; j <= seatsPerRow; j++) {
        layout.push({
          row: rowLetter,
          number: j,
          type: i < VIP_seats ? "VIP" : "REGULAR",
        });
      }
    }

    // 2️⃣ Create Theater
    const theater = await Theater.create({
      name,
      screenNumber,
      totalRows,
      seatsPerRow,
      layout,
    });

    const theaterId = theater._id;

    // 3️⃣ Prevent duplicate show same time
    const existingShow = await Show.findOne({
      theaterId,
      date,
      time,
    });
    // .session(session);

    if (existingShow) {
      throw new Error("Show already exists at this time");
    }

    // 4️⃣ Create Show
    const show = await Show.create({
      movieId,
      theaterId,
      date,
      time,
      price,
    });

    await movies.updateOne({ _id: movieId }, { showId: show._id });
    // 5️⃣ Commit Transaction
    // await session.commitTransaction();
    // session.endSession();

    res.status(201).json({
      success: true,
      message: "Theater and Show created successfully",
      theater: theater[0],
      show: show[0],
    });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// gets theater Details

export const getTheaterShowDetails = async (req, res) => {
  try {
    const { movieId } = req.query;

    const show = await Show.findOne({ movieId }).populate("theaterId");

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show will be coming soon",
      });
    }

    const theater = show.theaterId;

    res.status(200).json({
      success: true,
      message: {
        showId: show._id,
        movieId: show.movieId,
        date: show.date,
        time: show.time,
        price: show.price,
        bookedSeats: show.bookedSeats || [],
        theater: {
          name: theater.name,
          screenNumber: theater.screenNumber,
          totalRows: theater.totalRows,
          seatsPerRow: theater.seatsPerRow,
          layout: theater.layout,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Show booking and revenues
export const bookings_revenues = async (req, res) => {
  try {
    const { showId } = req.params;
    const data = await bookingSchema.aggregate([
      // 1. Match
      {
        $match: { showId: new mongoose.Types.ObjectId(showId) },
      },

      // 2. Group
      {
        $group: {
          _id: "$showId",
          totalRevenue: { $sum: "$totalAmount" },
          totalBookedTickets: { $sum: 1 },
        },
      },

      // 3. Lookup Show
      {
        $lookup: {
          from: "shows", // check your collection name
          localField: "_id", // FIXED
          foreignField: "_id",
          as: "showDetails",
          pipeline: [
            {
              $lookup: {
                from: "theaters", // check name
                localField: "theaterId",
                foreignField: "_id",
                as: "theater",
              },
            },
            // { $unwind: "$theater" }
          ],
        },
      },

      { $unwind: "$showDetails" },
      //  { $unwind: "$showDetails.theater" },
      // 4. Project
      {
        $project: {
          _id: 0,
          showId: "$_id",
          totalRevenue: 1,
          totalBookedTickets: 1,
          totalSeats: {
            $size: {
              $arrayElemAt: ["$showDetails.theater.layout", 0],
            },
          },
          //       totalSeats: {
          //   $size: {
          //     $arrayElemAt: [
          //       { $ifNull: ["$showDetails.theater.layout", []] },
          //       0
          //     ]
          //   }
          // },
          // remainingSeats: {
          //   $subtract: [
          //     {
          //       $size: {
          //         $arrayElemAt: [
          //           { $ifNull: ["$showDetails.theater.layout", []] },
          //           0
          //         ]
          //       }
          //     },
          //     "$totalBookedSeats"
          //   ]
          // },
          remainingSeats: {
            $subtract: [
              {
                $size: {
                  $arrayElemAt: ["$showDetails.theater.layout", 0],
                },
              },
              "$totalBookedTickets",
            ],
          },
          theater: "$showDetails.theater",
          bookedSeats: "$showDetails.bookedSeats",

          // layout: "$showDetails.theater.layout",
          price: "$showDetails.price",
          date: "$showDetails.date",
          time: "$showDetails.time",
        },
      },
    ]);
    res.status(200).json({
      message: data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong",
    });
  }
};
