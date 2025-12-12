import mongoose from "mongoose";

const { Schema } = mongoose;

const showSchema = new Schema(
  {
    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    hallName: {
      type: String, 
      default: "Main Hall",
    },
    showDateTime: {
      type: Date,
      required: true,
    },
    showPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    occupiedSeats: {
      type: Map,
      of: String,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

showSchema.index(
  { movie: 1, showDateTime: 1, hallName: 1 },
  { unique: true }
);


export default mongoose.model("Show", showSchema);
