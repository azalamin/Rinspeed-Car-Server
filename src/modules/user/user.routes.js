const express = require("express");
const router = express.Router();
const controller = require("./user.controller");
const verifyJWT = require("../../middleware/verifyJWT");

module.exports = (db) => {

    // Check if user is admin
    router.get("/admin/:email", verifyJWT, async (req, res) => {
        const email = req.params.email;
        const user = await db.collection("user").findOne({ email });

        res.send({ admin: user?.role === "admin" });
    });


    // Get user info
    router.get("/:email", verifyJWT, (req, res) =>
        controller.getUser(req, res, db)
    );

    // Update user
    router.put("/:email", verifyJWT, (req, res) =>
        controller.updateUser(req, res, db)
    );

    return router;
};
