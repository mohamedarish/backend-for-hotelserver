const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const cors = require("cors");

app.use(http);

app.use(express.json());

app.use("/api/user", userRoutes);

app.use(cors());

app.listen(8000, () => {
    console.log("Connected to port 8000");
});
