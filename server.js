const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
// const cors = require("cors");

// app.use(cors());
// app.options("*", cors());

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.use(express.json());

app.use("/api/user", userRoutes);

app.listen(8000, () => {
    console.log("Connected to port 8000");
});
