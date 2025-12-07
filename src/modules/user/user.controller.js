const jwt = require("jsonwebtoken");
const service = require("./user.service.js");

exports.upsertUser = async (req, res, db) => {
    const email = req.params.email;
    const user = req.body;

    const result = await service.updateUser(db, email, user);

    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });

    res.send({ result, accessToken: token });
};

exports.getUser = async (req, res, db) => {
    const user = await service.getUserByEmail(db, req.params.email);
    res.send(user);
};

exports.getAllUsers = async (req, res, db) => {
    const users = await service.getAllUsers(db);
    res.send(users.reverse());
};

exports.makeAdmin = async (req, res, db) => {
    const result = await service.makeAdmin(db, req.params.email);
    res.send(result);
};
