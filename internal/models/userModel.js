const mongoose = require("mongoose"); 
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: true,
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["user", "admin"], // The value of this field can only be "user" or "admin"
    default: "user" // The default value 
  }
});

// Pre-save middleware to hash the password before saving the user document
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10); 
    next(); 
  } catch (error) {
    next(error); 
  }
});

// Method to compare a plain-text password with the hashed password stored in the database
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); 
};

// Export the User model using the defined schema
module.exports = mongoose.model("User", UserSchema);