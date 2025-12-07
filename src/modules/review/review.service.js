// modules/review/review.service.js
module.exports = {
    async listReviews(col) {
        return col.find().sort({ createdAt: -1 }).toArray();
    },

    async createReview(col, payload) {
        const doc = { ...payload, createdAt: new Date() };
        return col.insertOne(doc);
    },
};
