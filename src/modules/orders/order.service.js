// modules/orders/order.service.js
const { ObjectId } = require("mongodb");

module.exports = {
    async createOrder(col, payload) {
        const doc = { ...payload, createdAt: new Date(), status: payload.status || "pending" };
        return col.insertOne(doc);
    },

    async listOrders(col) {
        return col.find().sort({ createdAt: -1 }).toArray();
    },

    async getOrdersByEmail(col, email) {
        return col.find({ email }).sort({ createdAt: -1 }).toArray();
    },

    async deleteOrder(col, id) {
        return col.deleteOne({ _id: new ObjectId(id) });
    },

    async getOrderById(col, id) {
        return col.findOne({ _id: new ObjectId(id) });
    },

    async updateOrder(col, id, update) {
        return col.updateOne({ _id: new ObjectId(id) }, { $set: update });
    },
};
