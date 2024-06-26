const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const cors = require("cors");

require("dotenv").config();

app.use(cors());
app.options("*", cors());

app.use(express.json());

app.use("/", userRoutes);

app.listen(8000, () => {
  console.log("Connected to port 8000");
});
