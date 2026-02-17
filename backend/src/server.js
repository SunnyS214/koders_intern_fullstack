require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const connectDB = require("./db");
connectDB();

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
