import mongoose from "mongoose";

const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    user: {
      type: String, 
      ref: "User",
      required: true,
    },
    show: {
      type: Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    bookedSeats: {
      type: [String], 
      required: true,
      validate: v => v.length > 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
