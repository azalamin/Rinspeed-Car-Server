// server.js
require("dotenv").config();
const connectDB = require("./src/config/db.js");
const app = require("./app.js");
const routes = require("./routes.js");

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dhgpv.mongodb.net/?retryWrites=true&w=majority`;

(async () => {
    try {
        const db = await connectDB(uri);

        // Load all routes with db instance
        routes(app, db);

        // Start server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
})();
