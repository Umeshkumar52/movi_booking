import mongoose, { Schema } from "mongoose";
const moviSchema = new mongoose.Schema({ 
  // common fields in movie and series
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
    year: {
      type: Number,
      require: true,
    },
    releaseDate: {
      type: Date,
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
    premium:{
      type:Boolean,
      default:false
    },
    price:{
      type:Number,
      require:function () {
        return this.premium
      }
    },
    poster: {
      type: String,
      require: true,
    },
   
    //  movie specific fields
    media: {
      type: String
    },
    views:{
    type:Number,
    default:0
    },
    duration: {
      type: Number,
      require: function () {
        return this.Category === "movie";
      },
    },
     trailer: {
      media: {
        type: String,
        require: function () {
        return this.Category === "movie";
      },
      },
      poster: {
        type: String,
        require:function() {
        return this.Category === "movie";
      },
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

    // series specific fields these update after
    totalSeasons: {
      type: Number,
      default: 0,
    },
    totalEpisodes: {
      type: Number,
      default: 0,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("movies", moviSchema);
