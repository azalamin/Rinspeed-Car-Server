// modules/review/review.routes.js
const express = require("express");
const router = express.Router();
const controller = require("./review.controller.js");
const verifyJWT = require("../../middleware/verifyJWT.js");

module.exports = (db) => {
    // GET /review
    router.get("/", (req, res) => controller.listReviews(req, res, db));

    // POST /review (can be public or protected — original was public)
    router.post("/", (req, res) => controller.createReview(req, res, db));

    return router;
};
