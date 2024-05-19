const express = require("express");
const {scrape} = require("./scrape");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/solar",(req,res) => {
  scrape(res);
  });

app.get("/", (req, res) => {
  res.send("Solis Solar Api Working..!");
}); 

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`); 
}); 