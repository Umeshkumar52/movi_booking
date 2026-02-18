import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema(
  {
    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movies",   // referencing Content collection
      required: true,
    },

    seasonNumber: {
      type: Number,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },

    description: {
      type: String,
    },

    releaseDate: {
      type: Date,
    },

    totalEpisodes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Prevent duplicate season numbers per series
seasonSchema.index({ series: 1, seasonNumber: 1 }, { unique: true });

export default mongoose.model("Season", seasonSchema);
