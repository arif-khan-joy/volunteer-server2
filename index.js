const express = require("express");

const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.arzqi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const port = 5000;
app.get("/", (req, res) => {
  res.send("hello from db it's working working");
});
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const volunteer = client.db("volunteerWork").collection("network");
  const userInfo = client.db("volunteerWork").collection("userInfo");
  app.post("/addProduct", (req, res) => {
    const product = req.body;

    volunteer.insertMany(product).then((result) => {
      // console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  app.get("/products", (req, res) => {
    volunteer
      .find({})
      .limit(20)

      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.get("/register/:id", (req, res) => {
    volunteer
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    // console.log(order);
    userInfo.insertOne(order).then((result) => {
      res.send({ name: "insertedCount", result });
    });
  });
  app.get("/singleData", (req, res) => {
    userInfo.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    // console.log(req.params.id);
    userInfo.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      res.send(result);
    });
  });
});

app.listen(process.env.PORT || port);
