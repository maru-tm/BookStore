const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }, 
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); 
  try {
    this.password = await bcrypt.hash(this.password, 10); 
    next();
  } catch (error) {
    next(error); 
  }
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); 
};

module.exports = mongoose.model("User", UserSchema);
