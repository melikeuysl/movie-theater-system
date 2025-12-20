import mongoose from "mongoose";

const { Schema } = mongoose;

const genreSchema = new Schema(
  {
    id: Number, 
    name: String,
  },
  { _id: false }
);

const castSchema = new Schema(
  {
    name: String,
    profile_path: String,
  },
  { _id: false }
);

const movieSchema = new Schema(
  {
    externalId: Number,
    title: { type: String, required: true },
    overview: String,
    poster_path: String,
    backdrop_path: String,
    genres: [genreSchema],
    casts: [castSchema],
    release_date: Date,
    original_language: String,
    tagline: String,
    vote_average: Number,
    vote_count: Number,
    runtime: Number,
    isNowShowing: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
