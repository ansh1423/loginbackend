import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true },
  age: { type: Number, required: true },
  dob: { type: Date, required: true },
  profileImage: { type: String, required: true }, // Image path
});

const User = mongoose.model("User", userSchema);
export default User;
