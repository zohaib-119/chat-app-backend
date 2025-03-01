const express = require('express')
const cors = require('cors');

const connectDB = require("./lib/db");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const messageRoutes = require("./routes/message.route");
const groupRoutes = require("./routes/group.route");
const groupMessageRoutes = require("./routes/groupMessage.route");

const {app, server} = require('./lib/socket');

require('dotenv').config();

app.use(cors({
    origin: process.env.FRONTEND_URL,
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/group-message", groupMessageRoutes);

server.listen(process.env.PORT, () => {
    console.log("Server running on port ", process.env.PORT)
    connectDB();
});
