// modules/review/review.controller.js
const model = require("./review.model.js");
const service = require("./review.service.js");
const { success, error } = require("../../utils/response.js");

exports.listReviews = async (req, res, db) => {
    try {
        const col = model(db);
        const rows = await service.listReviews(col);
        return success(res, rows);
    } catch (err) {
        return error(res, err.message);
    }
};

exports.createReview = async (req, res, db) => {
    try {
        const col = model(db);
        const result = await service.createReview(col, req.body);
        return success(res, result, 201);
    } catch (err) {
        return error(res, err.message);
    }
};
