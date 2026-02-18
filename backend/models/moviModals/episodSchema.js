import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema(
  {
    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "content",
      required: true,
    },

    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },

    episodeNumber: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    duration: {
      type: Number, // minutes
      required: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    releaseDate: {
      type: Date,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Prevent duplicate episode number inside same season
episodeSchema.index(
  { season: 1, episodeNumber: 1 },
  { unique: true }
);

export default mongoose.model("Episode", episodeSchema);
