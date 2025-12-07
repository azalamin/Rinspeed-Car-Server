// config/db.js
const { MongoClient } = require("mongodb");

async function connectDB(uri) {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    await client.connect();
    console.log("Database Connected");

    return client.db("RinspeedCar"); // your DB name
}

module.exports = connectDB;
