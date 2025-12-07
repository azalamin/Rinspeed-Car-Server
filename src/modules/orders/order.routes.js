const express = require("express");
const router = express.Router();

const controller = require("./order.controller");

const verifyJWT = require("../../middleware/verifyJWT");
const verifyAdmin = require("../../middleware/verifyAdmin");

module.exports = (db) => {

    // ============================================
    // 🔥 ADMIN: Get ALL orders
    // ============================================
    router.get("/all", (req, res) =>
        controller.listOrders(req, res, db)
    );

    // ============================================
    // 🔥 PAYMENT INFO (must come BEFORE :email route)
    // ============================================
    router.get("/payment/:orderId", (req, res) =>
        controller.getOrderById(req, res, db)
    );

    // ============================================
    // 🔥 USER / ADMIN: Get orders by email
    // ============================================
    router.get("/user/:email", verifyJWT, async (req, res) => {
        try {
            const requesterEmail = req.decoded.email;
            const targetEmail = req.params.email;

            const userCollection = db.collection("user");
            const requester = await userCollection.findOne({ email: requesterEmail });

            // Only admin can view all users' orders
            if (requesterEmail !== targetEmail && requester?.role !== "admin") {
                return res.status(403).send({ message: "Forbidden" });
            }

            return controller.getOrdersByEmail(req, res, db);

        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Server error" });
        }
    });

    // ============================================
    // 🔥 CREATE ORDER (no login required)
    // ============================================
    router.post("/", (req, res) =>
        controller.createOrder(req, res, db)
    );

    // ============================================
    // 🔥 DELETE ORDER (user or admin with token)
    // ============================================
    router.delete("/:orderId", verifyJWT, (req, res) =>
        controller.deleteOrder(req, res, db)
    );

    // ============================================
    // 🔥 UPDATE ORDER STATUS
    // ============================================
    router.patch("/:id", verifyJWT, (req, res) =>
        controller.updateOrder(req, res, db)
    );

    return router;
};
