import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    // Clerk'ten gelen id
    _id: {
      type: String,
      required: true,
    },
    name: String,
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  {
    timestamps: true,
    _id: false, 
  }
);

export default mongoose.model("User", userSchema);
