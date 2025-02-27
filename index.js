const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require("./lib/db");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const messageRoutes = require("./routes/message.route");
const groupRoutes = require("./routes/group.route");
const groupMessageRoutes = require("./routes/groupMessage.route");

const {app, server} = require('./lib/socket');

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/group-message", groupMessageRoutes);

server.listen(5000, () => {
    console.log("Server running on port 5000")
    connectDB();
});
