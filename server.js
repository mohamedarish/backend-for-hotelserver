const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const cors = require("cors");

app.use(express.json());

app.use(cors());

app.use("/api/user", userRoutes);

app.listen(8000, () => {
    console.log("Connected to port 8000");
});
