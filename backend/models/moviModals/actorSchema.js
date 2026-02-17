import mongoose from "mongoose";

const actorSchema = new mongoose.Schema({
  movie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "movies",
  },
  name: {
    type: String,
    require: true,
  },
  img: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
});
export default mongoose.model("actor", actorSchema);
