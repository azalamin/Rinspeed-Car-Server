// modules/orders/order.controller.js
const model = require("./order.model.js");
const service = require("./order.service.js");
const { success, error } = require("../../utils/response.js");

exports.createOrder = async (req, res, db) => {
    try {
        const ordersCol = model(db);
        const result = await service.createOrder(ordersCol, req.body);
        return success(res, result, 201);
    } catch (err) {
        return error(res, err.message);
    }
};

exports.listOrders = async (req, res, db) => {
    try {
        const ordersCol = model(db);
        const rows = await service.listOrders(ordersCol);
        return success(res, rows);
    } catch (err) {
        return error(res, err.message);
    }
};

exports.getOrdersByEmail = async (req, res, db) => {
    try {
        const email = req.params.email || req.query.email;
        const ordersCol = model(db);
        const rows = await service.getOrdersByEmail(ordersCol, email);
        return success(res, rows);
    } catch (err) {
        return error(res, err.message);
    }
};

exports.deleteOrder = async (req, res, db) => {
    try {
        const id = req.params.orderId || req.params.id;
        const ordersCol = model(db);
        const result = await service.deleteOrder(ordersCol, id);
        return success(res, result);
    } catch (err) {
        return error(res, err.message);
    }
};

exports.getOrderById = async (req, res, db) => {
    try {
        const id = req.params.orderId || req.query.orderId || req.params.id;
        const ordersCol = model(db);
        const row = await service.getOrderById(ordersCol, id);
        return success(res, row);
    } catch (err) {
        return error(res, err.message);
    }
};

exports.updateOrder = async (req, res, db) => {
    try {
        const id = req.params.id || req.query.id;
        const ordersCol = model(db);
        const result = await service.updateOrder(ordersCol, id, req.body);
        return success(res, result);
    } catch (err) {
        return error(res, err.message);
    }
};
