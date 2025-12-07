// routes.js
module.exports = (app, db) => {
    app.use("/user", require("./src/modules/user/user.routes.js")(db));
    app.use("/parts", require("./src/modules/parts/parts.routes.js")(db));
    app.use("/orders", require("./src/modules/orders/order.routes.js")(db));
    app.use("/review", require("./src/modules/review/review.routes.js")(db));
    app.use("/payment", require("./src/modules/payment/payment.routes.js")(db));
};