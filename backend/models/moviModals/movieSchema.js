import mongoose, { Schema } from "mongoose";
const moviSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    main_title: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    Category: {
      type: String,
      enum: ["movie", "series"],
      default: "movie",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    duration: {
      type: Number,
      require: true,
    },
    year: {
      type: Number,
      require: true,
    },
    rating: {
      type: Number,
    },
    language: {
      type: String,
      default: "Hindi",
    },
    genres: {
      type: String,
      require: true,
    },

    storyline: {
      type: String,
      require: true,
    },

    price: Number,
    poster: {
      type: String,
      require: true,
    },
    media: {
      type: String,
      require: true,
    },
    trailer: {
      media: {
        type: String,
        require: true,
      },
      poster: {
        type: String,
        require: true,
      },
    },
    actores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "actor",
      },
    ],

    crew: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "crew",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("movies", moviSchema);
