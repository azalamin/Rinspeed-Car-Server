module.exports = function verifyAdmin(db) {
    return async function (req, res, next) {
        try {
            const userCollection = db.collection("user");
            const requester = req.decoded.email;

            const user = await userCollection.findOne({ email: requester });

            if (user?.role !== "admin") {
                return res.status(403).send({ message: "Forbidden: Admin only" });
            }

            next();
        } catch (err) {
            console.log(err);
            res.status(500).send({ message: "Internal server error" });
        }
    };
};
