const express = require("express");
const router = express.Router();
const controller = require("./parts.controller.js");
const verifyJWT = require("../../middleware/verifyJWT.js");

module.exports = (db) => {
    // ============================
    // GET ALL PARTS (returns array)
    // ============================
    router.get("/", async (req, res) => {
        return controller.listParts(req, res, db);
    });

    // ===================================
    // GET SINGLE PART BY ID (clean route)
    // ===================================
    router.get("/:id", async (req, res) => {
        return controller.getPart(req, res, db);
    });

    // ======================
    // CREATE A PART (Admin)
    // ======================
    router.post("/", verifyJWT, async (req, res) => {
        return controller.createPart(req, res, db);
    });

    // =======================
    // DELETE A PART (Admin)
    // =======================
    router.delete("/delete/:partId", verifyJWT, async (req, res) => {
        return controller.deletePart(req, res, db);
    });

    return router;
};
