// modules/parts/parts.controller.js
const service = require("./parts.service.js");
const partsModel = require("./parts.model.js");
const { success, error } = require("../../utils/response.js");

exports.listParts = async (req, res, db) => {
    try {
        const partsCol = partsModel(db);
        const rows = await service.listParts(partsCol);
        return success(res, rows);
    } catch (err) {
        return error(res, err.message);
    }
};

exports.getPart = async (req, res, db) => {
    try {
        const id = req.params.id || req.query.id;
        const partsCol = partsModel(db);
        const part = await service.getPartById(partsCol, id);
        return success(res, part);
    } catch (err) {
        return error(res, err.message);
    }
};

exports.createPart = async (req, res, db) => {
    try {
        const payload = req.body;
        const partsCol = partsModel(db);
        const result = await service.createPart(partsCol, payload);
        return success(res, result, 201);
    } catch (err) {
        return error(res, err.message);
    }
};

exports.deletePart = async (req, res, db) => {
    try {
        const id = req.params.partId || req.query.id;
        const partsCol = partsModel(db);
        const result = await service.deletePart(partsCol, id);
        return success(res, result);
    } catch (err) {
        return error(res, err.message);
    }
};
