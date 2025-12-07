const express = require("express");
const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT.js");
const controller = require("./user.controller.js");

module.exports = (db) => {
    router.put("/:email", (req, res) => controller.upsertUser(req, res, db));

    router.get("/:email", verifyJWT, (req, res) =>
        controller.getUser(req, res, db)
    );

    router.get("/", (req, res) => controller.getAllUsers(req, res, db));

    router.put("/admin/:email", (req, res) =>
        controller.makeAdmin(req, res, db)
    );

    return router;
};
