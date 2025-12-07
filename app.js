// app.js
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.send("Welcome to Rinspeed Website ");
});

module.exports = app;
