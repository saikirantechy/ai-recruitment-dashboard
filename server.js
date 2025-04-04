const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Define Mongoose Schema and Model
const CandidateSchema = new mongoose.Schema({ name: String });
const Candidate = mongoose.model("Candidate", CandidateSchema);

// File Upload Setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Store files in 'uploads' folder
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname); // Unique filename
    },
  });
  const upload = multer({ storage: storage });
  
app.post("/api/upload-resume", upload.single("resume"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    res.json({ message: "Resume uploaded successfully!" });
});

app.get("/api/start-interview", async (req, res) => {
    res.json({ message: "Interview started. AI processing responses..." });
});

app.get("/api/get-candidates", async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json({ candidates: candidates.map(c => c.name) });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ message: "Error fetching candidates" });
    }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
