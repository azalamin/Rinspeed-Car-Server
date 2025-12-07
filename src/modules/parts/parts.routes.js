// modules/parts/parts.routes.js
const express = require("express");
const router = express.Router();
const controller = require("./parts.controller.js");
const verifyJWT = require("../../middleware/verifyJWT.js");

// db will be injected by routes loader
module.exports = (db) => {
    // GET /parts  -> list
    router.get("/", (req, res) => controller.listParts(req, res, db));

    // GET /parts/single?id=...
    router.get("/single", (req, res) => controller.getPart(req, res, db));

    // GET /parts/:id  (alternate)
    router.get("/:id", (req, res) => controller.getPart(req, res, db));

    // POST /parts (protected)
    router.post("/", verifyJWT, (req, res) => controller.createPart(req, res, db));

    // DELETE /parts/delete/:partId
    router.delete("/delete/:partId", verifyJWT, (req, res) =>
        controller.deletePart(req, res, db)
    );

    return router;
};
