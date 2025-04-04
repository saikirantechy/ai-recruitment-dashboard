const mongoose = require("mongoose");

// Replace <db_password> with your actual password
const MONGO_URI = "mongodb+srv://iamskt13:mypassword123@cluster0.h5gzj.mongodb.net/ai_recruitment?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected...");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
