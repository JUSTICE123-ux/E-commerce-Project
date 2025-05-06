import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerifed: { type: Boolean, default: false },
});

const newInfo = mongoose.model("userINFO", userSchema);

export default newInfo;
