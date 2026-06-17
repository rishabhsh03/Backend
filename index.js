require("dotenv").config();
const express = require("express");
const db = require("./db");
const router = require("./router/route");

const app = express();

const PORT = process.env.PORT || 7000;
console.log(PORT);

app.get("/welcomepage", (req, res) => {
  res.send("Hi! Server is listening");
});

// Register routes
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});