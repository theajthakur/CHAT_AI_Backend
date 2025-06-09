const axios = require("axios");
const express = require("express");
const app = express();
const port = 7778;
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routers/auth");

app.use("/api/auth", authRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
