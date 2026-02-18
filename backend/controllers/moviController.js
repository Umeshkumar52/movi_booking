import { notificationEvent } from "../methods/notificationEvent.js";
import actorSchema from "../models/moviModals/actorSchema.js";
import crewSchema from "../models/moviModals/crewSchema.js";
import movies from "../models/moviModals/movieSchema.js";
import seatsSchema from "../models/seatsSchema.js";
import { uploadToCloudinary } from "../methods/uploadToCloudinary.js";
import seasonSchema from "../models/moviModals/sessionSchema.js";
import episodeSchema from "../models/moviModals/episodSchema.js";
import { createOrder } from "./notificationController.js";
export const getMovies = async (req, res) => {
  try {
    const page = Number(req.params.page || req.query.page) || 1;
    const limit = Number(req.params.limit || req.query.limit) || 10;
    const skipPage = (page - 1) * limit;
    
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
    const { _id } = req.query;
    // let bookedSeats = 0;
    // let remainSeats = 0;

    const response = await movies.findById(_id);
    // .populate("actore")
    // .populate("crew")

    // .lean();
    // const seats = await seatsSchema
    //   .find({ movi_id: _id })
    //   .sort({ row: 1, col: 1 })
    //   .populate("bookedBy", "FullName _id")
    //   .lean();
    // seats.forEach((item) => {
    //   if (item.isBooked) {
    //     bookedSeats += 1;
    //   }
    // });
    // remainSeats = seats.length - bookedSeats;
    return res.status(200).json({
      message: response,
      // { ...response, bookedSeats, remainSeats, seatScreen: seats },
    });
  } catch (err) {
    console.log(err);
    return res.status(301).json({
      message: "Something went wrong !",
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
      Category
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
        posterPath ? uploadToCloudinary(posterPath, "movies/posters") : Promise.resolve(""),
        mediaPath ? uploadToCloudinary(mediaPath, "movies/media") : Promise.resolve(""),
        trailerPosterPath ? uploadToCloudinary(trailerPosterPath, "movies/trailers/posters") : Promise.resolve(""),
        trailerMediaPath ? uploadToCloudinary(trailerMediaPath, "movies/trailers/media") : Promise.resolve(""),
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
    const { SearchKey } = req.query;
    if (SearchKey) {
      const searchRegex = { $regex: SearchKey, $options: "i" };
      
      // Build $or query for multiple fields
      const query = {
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
        query.$or.push({ year: Number(SearchKey) });
      }

      const response = await movies
        .find(query)
        .sort({ createdAt: -1 });
        
      return res.status(200).json({
        message: response,
      });
    }
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
      'main_title', 'title', 'Category', 'status', 'year', 'releaseDate', 
      'rating', 'language', 'genres', 'storyline', 'premium', 'price', 
      'duration', 'isCompleted'
    ];

    const bodyData = {};
    whitelist.forEach(key => {
      if (req.body[key] !== undefined) {
        let value = req.body[key];
        
        // Accurate type casting for FormData strings
        if (['year', 'rating', 'price', 'duration'].includes(key)) {
          value = value === "" ? undefined : Number(value);
        } else if (['premium', 'isCompleted'].includes(key)) {
          value = String(value) === 'true';
        }
        
        bodyData[key] = value;
      }
    });

    // Handle poster file update individually
    if (req.file) {
      bodyData.poster = await uploadToCloudinary(req.file.path, "movies/posters");
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
      bodyData["trailer.poster"] = await uploadToCloudinary(trailerPosterPath, "movies/trailers/posters");
    }
    if (trailerMediaPath) {
      bodyData["trailer.media"] = await uploadToCloudinary(trailerMediaPath, "movies/trailers/media");
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
      bodyData["poster"] = await uploadToCloudinary(posterPath, "movies/posters");
    }
    if (mediaPath) {
      bodyData["media"] = await uploadToCloudinary(mediaPath, "movies/media");
    }

    const data = await movies.findByIdAndUpdate(movie_id, {
      $set: bodyData,
    },{new:true});
    res.status(200).json({
      message:{
        media:bodyData?.media??data.media ,
        poster:bodyData?.poster??data.poster
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
      updates["source_url"] = await uploadToCloudinary(req.file.path, "movies/source");
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
      return res.status(400).json({ message: "Series ID and Season Number are required" });
    }

    let banner = "";
    if (req.file) {
      banner = await uploadToCloudinary(req.file.path, "seasons/banners");
    } else if (!req.body.banner) {
       return res.status(400).json({ message: "Season banner is required" });
    }

    const season = await seasonSchema.create({
      ...req.body,
      banner: banner || req.body.banner
    });

    res.status(201).json({
      message: season,
    });
  } catch (error) {
    console.error("Add Season Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Season number already exists for this series" });
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
      updates.banner = await uploadToCloudinary(req.file.path, "seasons/banners");
    }

    const season = await seasonSchema.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
    );

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
      return res.status(400).json({ message: "Missing required episode details" });
    }

    let videoUrl = "";
    let thumbnail = "";

    if (req.files) {
      const videoPath = req.files.video?.[0]?.path;
      const thumbPath = req.files.thumbnail?.[0]?.path;

      if (videoPath) videoUrl = await uploadToCloudinary(videoPath, "episodes/videos");
      if (thumbPath) thumbnail = await uploadToCloudinary(thumbPath, "episodes/thumbnails");
    }

    const episode = await episodeSchema.create({
      ...req.body,
      videoUrl,
      thumbnail
    });

    res.status(201).json({
      message: episode,
    });
  } catch (error) {
    console.error("Add Episode Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Episode number already exists for this season" });
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
    const seasons = await seasonSchema.find({ series: seriesId }).sort({ seasonNumber: 1 });

    return res.status(200).json({
      message: {
        series,
        seasons
      }
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
    const episodes = await episodeSchema.find({ season: seasonId }).sort({ episodeNumber: 1 });

    return res.status(200).json({
      message: {
        season,
        episodes
      }
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

      if (videoPath) updates.videoUrl = await uploadToCloudinary(videoPath, "episodes/videos");
      if (thumbPath) updates.thumbnail = await uploadToCloudinary(thumbPath, "episodes/thumbnails");
    }

    const episode = await episodeSchema.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true }
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
