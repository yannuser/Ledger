import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from './routes/userRoutes.js';
import learningGoalRoutes from "./routes/learningGoalRoutes.js";
import effortRecordRoutes from "./routes/effortRecordRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to accept JSON data

// routes
app.use('/User', userRoutes);
app.use('/LearningGoal', learningGoalRoutes);
app.use('/EffortRecord', effortRecordRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Basic routeSS
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.listen(PORT, () => console.log(`Server running on port  http://localhost:${PORT}`));
