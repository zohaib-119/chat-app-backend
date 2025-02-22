const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');



const connectDB = require("./lib/db");
const userRoutes = require("./routes/user.route");
const messageRoutes = require("./routes/message.route");

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000")
    connectDB();
});