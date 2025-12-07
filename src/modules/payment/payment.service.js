// modules/payment/payment.service.js
const { ObjectId } = require("mongodb");

module.exports = {
    async createPaymentRecord(col, payload) {
        const doc = { ...payload, createdAt: new Date() };
        return col.insertOne(doc);
    },

    async updateOrderPayment(orderCol, id, transactionId) {
        return orderCol.updateOne(
            { _id: new ObjectId(id) },
            { $set: { paid: true, transactionId } },
            { upsert: true }
        );
    },
};
