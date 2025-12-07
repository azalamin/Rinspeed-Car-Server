const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "Unauthorized: No Token" });

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden: Invalid Token" });
        req.decoded = decoded;
        next();
    });
};