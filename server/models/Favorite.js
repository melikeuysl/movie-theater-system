import mongoose from "mongoose";
const { Schema } = mongoose;

const favoriteSchema = new Schema(
  {
    userId: { type: String, required: true },
    movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, movie: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
