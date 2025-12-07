// modules/payment/payment.controller.js
const paymentModel = require("./payment.model.js");
const paymentService = require("./payment.service.js");
const { success, error } = require("../../utils/response.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
    try {
        const { totalPrice } = req.body || {};
        if (!totalPrice) return error(res, "totalPrice is required", 400);

        const amount = Math.round(Number(totalPrice) * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ["card"],
        });

        return success(res, { clientSecret: paymentIntent.client_secret });
    } catch (err) {
        return error(res, err.message || "Stripe error");
    }
};

exports.updatePayment = async (req, res, db) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        if (!id) return error(res, "Order id required", 400);

        const payCol = paymentModel(db);
        await paymentService.createPaymentRecord(payCol, payload);

        const ordersCol = db.collection("orders");
        const result = await paymentService.updateOrderPayment(ordersCol, id, payload.transactionId);

        return success(res, result);
    } catch (err) {
        return error(res, err.message);
    }
};
