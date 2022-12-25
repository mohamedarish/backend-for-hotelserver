const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const cors = require("cors");

app.use(express.json());

app.use("/api/user", userRoutes);

app.options("/url...", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST");
    res.header("Access-Control-Allow-Headers", "accept, content-type");
    res.header("Access-Control-Max-Age", "1728000");
    return res.sendStatus(200);
});

app.listen(8000, () => {
    console.log("Connected to port 8000");
});
