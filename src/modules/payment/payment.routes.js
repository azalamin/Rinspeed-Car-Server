// modules/payment/payment.routes.js
const express = require("express");
const router = express.Router();
const controller = require("./payment.controller.js");
const verifyJWT = require("../../middleware/verifyJWT.js");

module.exports = (db) => {
    // POST /payment/create -> create stripe payment intent
    router.post("/create", (req, res) => controller.createPaymentIntent(req, res, db));

    // PATCH /payment/update/:id -> update order as paid
    router.patch("/update/:id", verifyJWT, (req, res) => controller.updatePayment(req, res, db));

    return router;
};
