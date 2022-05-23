const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

async function run() {
  try {
    await client.connect();
    const userCollection = client.db("RinspeedCar").collection("user");
    const paymentCollection = client.db("RinspeedCar").collection("payment");
    const partsCollection = client.db("RinspeedCar").collection("parts");
    const orderCollection = client.db("RinspeedCar").collection("orders");
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

    // parts api
    app.get("/parts", async (req, res) => {
      const result = (
        await partsCollection.find().limit(6).toArray()
      ).reverse();
      res.send(result);
    });

    app.get("/parts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await partsCollection.findOne(query);
      res.send(result);
    });

    //* orders api //
    //POST ORDER
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    // UPDATE PAYMENT
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
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Todo app");
});

app.listen(port, () => {
  console.log("Listen to the port", port);
});
