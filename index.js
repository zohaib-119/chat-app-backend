const express = require("express");
const cors = require('cors');

const connectDB = require("./lib/db");

const app = express();

app.use(cors());

app.listen(5000, () => {
    console.log("Server running on port 5000")
    connectDB();
});
