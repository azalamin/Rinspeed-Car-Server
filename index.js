const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dhgpv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  const token = authHeader?.split(" ")[1];
  if (!authHeader) {
    return res.status(401).send({ message: "UnAuthorized Access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    req.decoded = decoded;
    next();
  });
};

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("RinspeedCar").collection("user");
    const paymentCollection = client.db("RinspeedCar").collection("payment");
    const partsCollection = client.db("RinspeedCar").collection("parts");
    const orderCollection = client.db("RinspeedCar").collection("orders");
    const reviewCollection = client.db("RinspeedCar").collection("review");
    console.log("db connected");

    // STRIPE PAYMENT
    app.post("/create-payment", async (req, res) => {
      const { totalPrice } = req?.body;
      if (totalPrice) {
        const amount = totalPrice * 100;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_method_types: ["card"],
        });
        return res.send({ clientSecret: paymentIntent.client_secret });
      }
    });

    // Store User Info
    app.put("/user/:email", async (req, res) => {
      const email = req.params?.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updatedUser = {
        $set: user,
      };
      const result = await userCollection.updateOne(
        filter,
        updatedUser,
        options
      );
      const token = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.send({ result, accessToken: token });
    });

    app.put("/admin/:email", async (req, res) => {
      const email = req.params?.email;
      const filter = { email: email };
      const updatedUser = {
        $set: { role: "admin" },
      };
      const result = await userCollection.updateOne(filter, updatedUser);
      res.send(result);
    });

    // SIngle user api
    app.get("/user/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // SIngle user api
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user?.role === "admin";
      res.send({ admin: isAdmin });
    });

    // Get Users
    app.get("/user", async (req, res) => {
      const result = (await userCollection.find().toArray()).reverse();
      res.send(result);
    });

    // parts api
    app.get("/parts", async (req, res) => {
      const result = (await partsCollection.find().toArray()).reverse();
      res.send(result);
    });

    //POST ORDER
    app.post("/post-part", verifyJWT, async (req, res) => {
      const parts = req.body;
      const result = await partsCollection.insertOne(parts);
      res.send(result);
    });

    // Get Single part
    app.get("/parts/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await partsCollection.findOne(query);
      res.send(result);
    });

    // DELETE Single part
    app.delete("/delete-part/:partId", async (req, res) => {
      const { partId } = req.params;
      const filter = { _id: ObjectId(partId) };
      const result = await partsCollection.deleteOne(filter);
      res.send(result);
    });

    // MAKE PAYMENT
    app.patch("/payment-update/:id", async (req, res) => {
      const payment = req.body;
      const { id } = req.params;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: { paid: true, transactionId: payment.transactionId },
      };
      const options = { upsert: true };
      const paymentResult = await paymentCollection.insertOne(payment);
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Place order to shipped
    app.patch("/confirm-order/:id", async (req, res) => {
      const { id } = req.params;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: { status: "shipped" },
      };
      const options = { upsert: true };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //* orders api //
    //POST ORDER
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    // Get All Orders
    app.get("/get-orders", async (req, res) => {
      const result = (await orderCollection.find().toArray()).reverse();
      res.send(result);
    });

    // GET Single Order
    app.get("/orders/:email", async (req, res) => {
      const { email } = req.params;
      const query = { email: email };
      const result = (await orderCollection.find(query).toArray()).reverse();
      res.send(result);
    });

    // DELETE Single Order
    app.delete("/orders/:orderId", async (req, res) => {
      const { orderId } = req.params;
      const filter = { _id: ObjectId(orderId) };
      const result = await orderCollection.deleteOne(filter);
      res.send(result);
    });

    // GET Single Order
    app.get("/payment/:orderId", async (req, res) => {
      const { orderId } = req.params;
      const filter = { _id: ObjectId(orderId) };
      const result = await orderCollection.findOne(filter);
      res.send(result);
    });

    // POST Review
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // Get Reviews
    app.get("/review", async (req, res) => {
      const result = (await reviewCollection.find().toArray()).reverse();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Rinspeed Website");
});

app.listen(port, () => {
  console.log("Listen to the port", port);
});
