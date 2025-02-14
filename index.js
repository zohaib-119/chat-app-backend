const express = require("express");
const cors = require('cors');

const connectDB = require("./lib/db");
const userRoutes = require("./routes/user.route");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000")
    connectDB();
});