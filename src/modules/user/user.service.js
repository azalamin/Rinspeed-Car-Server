module.exports = {
    async updateUser(db, email, data) {
        return db.collection("user").updateOne(
            { email },
            { $set: data },
            { upsert: true }
        );
    },

    async getUserByEmail(db, email) {
        return db.collection("user").findOne({ email });
    },

    async getAllUsers(db) {
        return db.collection("user").find().toArray();
    },

    async makeAdmin(db, email) {
        return db.collection("user").updateOne({ email }, { $set: { role: "admin" } });
    },
};
