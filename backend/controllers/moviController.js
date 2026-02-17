import { notificationEvent } from "../methods/notificationEvent.js";
import actorSchema from "../models/moviModals/actorSchema.js";
import crewSchema from "../models/moviModals/crewSchema.js";
import movies from "../models/moviModals/movieSchema.js";
import seatsSchema from "../models/seatsSchema.js";
import { createOrder } from "./notificationController.js";
export const getMovies = async (req, res) => {
  try {
    const page = Number(req.params.page) || 1;
    const limit = Number(req.params.limit) || 10;
    const skipPage = (page - 1) * limit;
    
    const response = await movies
      .find()
      .sort({ createdAt: -1, _id: -1 }) // Deterministic sorting
      .skip(skipPage)
      .limit(limit)
      .lean();
      
    const documents = await movies.countDocuments().lean();
    
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
    if (req.files) {
      const poster = req.files.poster?.[0]?.filename
        ? `${process.env.UPLOAD_PATH}${req.files.poster[0].filename}`
        : "";
      const media = req.files.media?.[0]?.filename
        ? `${process.env.UPLOAD_PATH}${req.files.media[0].filename}`
        : "";
      const trailerPoster = req.files.trailerPoster?.[0]?.filename
        ? `${process.env.UPLOAD_PATH}${req.files.trailerPoster[0].filename}`
        : "";
      const trailerMedia = req.files.trailerMedia?.[0]?.filename
        ? `${process.env.UPLOAD_PATH}${req.files.trailerMedia[0].filename}`
        : "";

      const response = await movies.create({
        ...req.body,
        media,
        poster,
        "trailer.poster": trailerPoster,
        "trailer.media": trailerMedia,
      });

      // create seats structure
      // const seats = [];
      // for (let i = 0; i < rows; i++) {
      //   let rowLetter = String.fromCharCode(65 + i);
      //   for (let j = 1; j <= cols; j++) {
      //     seats.push({
      //       movi_id: response._id,
      //       seatNumber: `${rowLetter}${j}`,
      //       row: rowLetter,
      //       col: j,
      //       isBooked: false,
      //     });
      //   }
      // }
      // await seatsSchema.insertMany(seats);

      return res.status(200).json({
        message: response,
      });
    }
  } catch (err) {
    return res.status(301).json({
      message: "Something went wrong !",
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
    const {
      name,
      main_title,
      title,
      Category,
      status,
      duration,
      year,
      rating,
      language,
      genres,
      storyline,
      price,
    } = req.body;
    const data = await movies.findByIdAndUpdate(movie_id, {
      $set: {
        name,
        main_title,
        title,
        Category,
        status,
        duration,
        year,
        rating,
        language,
        genres,
        storyline,
        price,
      },
    },{new:true});
   
    res.status(200).json({
      message: data,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed to updated",
    });
  }
};

export const updateMovieTrailer = async (req, res) => {
  try {
    const { movie_id } = req.params;
    const bodyData = {};
    const trailerPoster = req.files.trailerPoster?.[0]?.filename;
    const trailerMedia = req.files.trailerMedia?.[0]?.filename;
    if (trailerPoster) {
      bodyData["trailer.poster"] = `${process.env.UPLOAD_PATH}${trailerPoster}`;
    }
    if (trailerMedia) {
      bodyData["trailer.media"] = `${process.env.UPLOAD_PATH}${trailerMedia}`;
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
    res.status(400).json({
      message: "failed to updated",
    });
  }
};

export const updateMovieMedia = async (req, res) => {
  try {
   
    const { movie_id } = req.params;
    const bodyData = {};
    const poster = req.files?.poster?.[0]?.filename;
    const media = req.files?.media?.[0]?.filename;
    console.log(poster, media);
    if (poster) {
      bodyData["poster"] = `${process.env.UPLOAD_PATH}/${poster}`;
    }
    if (media) {
      bodyData["media"] = `${process.env.UPLOAD_PATH}/${media}`;
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
    res.status(400).json({
      message: "failed to updated",
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { _id } = req.query;
    const { cols, rows } = req.body;
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
      const VideoUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      updates["source_url"] = VideoUrl;
    }

    const response = await movies.findByIdAndUpdate(
      _id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    // to update seats structure tehse possible cases
    // case 1 -> row incr
    // case 2 -> col incres
    // case 3 -> row inc col dec
    // case 4 -> row dec col inc
    // case 5 -both inc
    // case 6 -> both dec

    // if (response.cols !== cols || response.rows !== rows) {
    //   const seats = [];
    //   for (let i = 0; i < rows; i++) {
    //     let rowLetter = String.fromCharCode(65 + i);
    //     for (let j = 1; j <= cols; j++) {
    //       seats.push({
    //         movi_id: response._id,
    //         seatNumber: `${rowLetter}${j}`,
    //         isBooked: false,
    //       });
    //     }
    //   }
    //   await seatsSchema.insertMany(seats);
    // }
    return res.status(200).json({
      message: response,
    });
  } catch (err) {
    return res.status(301).json({
      message: "Something went wrong",
    });
  }
};

export const addNewActor = async (req, res) => {
  try {
   
    let img = "";
    if (req.file) {
      img = `${process.env.UPLOAD_PATH}${req.file.filename}`;
    }
    const actor = await actorSchema.create({ ...req.body, img });
    res.status(200).json({
      message: actor,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed to create actore",
    });
  }
};

export const addNewCrew = async (req, res) => {
  try {
   
    let img = "";
    if (req.file) {
      img = `${process.env.UPLOAD_PATH}${req.file.filename}`;
    }
    const data = await crewSchema.create({ ...req.body, img });
    res.status(200).json({
      message: data,
    });
  } catch (error) {
    res.status(400).json({
      message: "failed to create",
    });
  }
};

export const updateActor = async (req, res) => {
  try {
    
    const { _id } = req.query;
    let data;
    if (req.file && req.file.filename) {
      const img = `${process.env.UPLOAD_PATH}${req.file.filename}`;
      data = await actorSchema.findByIdAndUpdate(
        _id,
        {
          $set: { ...req.body, img },
        },
        { new: true },
      );
    } else {
      data = await actorSchema.findByIdAndUpdate(
        _id,
        { $set: req.body },
        { new: true },
      );
    }
    res.status(200).json({
      message: data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "failed to updated",
    });
  }
};

export const updateCrew = async (req, res) => {
  try {
    
    const { _id } = req.query;
    let data;
    if (req.file && req.file.filename) {
      const img = `${process.env.UPLOAD_PATH}${req.file.filename}`;
      data = await crewSchema.findByIdAndUpdate(
        _id,
        { $set: { ...req.body, img } },
        { new: true },
      );
    } else {
      data = await crewSchema.findByIdAndUpdate(
        _id,
        { $set: req.body },
        { new: true },
      );
    }
    res.status(200).json({
      message: data,
    });
  } catch (error) {
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
