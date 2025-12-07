const express = require("express");
const router = express.Router();

const controller = require("./order.controller");

// ✅ Correct imports
const verifyJWT = require("../../middleware/verifyJWT");
const verifyAdmin = require("../../middleware/verifyAdmin");

module.exports = (db) => {

    // Admin only
    router.get("/all", verifyJWT, verifyAdmin(db), (req, res) =>
        controller.listOrders(req, res, db)
    );

    // User or Admin
    router.get("/:email", verifyJWT, async (req, res) => {
        try {
            const requesterEmail = req.decoded.email;
            const targetEmail = req.params.email;

            const userCollection = db.collection("user");
            const requester = await userCollection.findOne({ email: requesterEmail });

            if (requesterEmail !== targetEmail && requester?.role !== "admin") {
                return res.status(403).send({ message: "Forbidden: Not allowed" });
            }

            return controller.getOrdersByEmail(req, res, db);

        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: "Server error" });
        }
    });

    // Other CRUD routes ...
    router.post("/", (req, res) => controller.createOrder(req, res, db));

    router.delete("/:orderId", verifyJWT, (req, res) =>
        controller.deleteOrder(req, res, db)
    );

    router.get("/payment/:orderId", (req, res) =>
        controller.getOrderById(req, res, db)
    );

    router.patch("/:id", verifyJWT, (req, res) =>
        controller.updateOrder(req, res, db)
    );

    return router;
};
