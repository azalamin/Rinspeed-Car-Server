// modules/parts/parts.service.js
const { ObjectId } = require("mongodb");

module.exports = {
    async listParts(partsCol) {
        return partsCol.find().sort({ createdAt: -1 }).toArray();
    },

    async getPartById(partsCol, id) {
        return partsCol.findOne({ _id: new ObjectId(id) });
    },

    async createPart(partsCol, payload) {
        const doc = { ...payload, createdAt: new Date() };
        return partsCol.insertOne(doc);
    },

    async deletePart(partsCol, id) {
        return partsCol.deleteOne({ _id: new ObjectId(id) });
    },
};
