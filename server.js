const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload")

var corsOptions = {
  origin: "*"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// simple route
app.use(fileUpload())
app.get("/", (req, res) => {
  res.json({ message: "Welcome to welink app." });
});

process.env.TZ = "Asia/Bangkok";
console.log(new Date().toString());
//routes import here
require('./app/routes/user.routes')(app);
require('./app/routes/reserve.routes')(app);
// set port, listen for requests
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  const db = require("./app/models/dbconnection");
// console.log(db);
});
