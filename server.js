const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to welink app." });
});

process.env.TZ = "Asia/Bangkok";
console.log(new Date().toString());
//routes import here
require('./app/routes/attendance.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/employee.routes')(app);
require('./app/routes/company.routes')(app);


// set port, listen for requests
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
