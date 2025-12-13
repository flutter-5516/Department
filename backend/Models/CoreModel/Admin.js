import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender:{
    type:String,
    required :true,
    enum: ["male", "female", "Rather Not say"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "owner",
    enum: ["owner"],
  },
});

module.exports = mongoose.model("Admin", adminSchema);
