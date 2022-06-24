const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload")
const swaggerUi = require('swagger-ui-express')

var corsOptions = {
  origin: "http://localhost:3000"
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
app.use('/doc/attendance', swaggerUi.serveFiles(require('./attendance_swagger_output.json'), {}), swaggerUi.setup(require('./attendance_swagger_output.json')))
app.use('/doc/company', swaggerUi.serveFiles(require('./company_swagger_output.json'), {}), swaggerUi.setup(require('./company_swagger_output.json')))
app.use('/doc/department', swaggerUi.serveFiles(require('./department_swagger_output.json'), {}), swaggerUi.setup(require('./department_swagger_output.json')))
app.use('/doc/healthinfo', swaggerUi.serveFiles(require('./healthinfo_swagger_output.json'), {}), swaggerUi.setup(require('./healthinfo_swagger_output.json')))
app.use('/doc/position', swaggerUi.serveFiles(require('./position_swagger_output.json'), {}), swaggerUi.setup(require('./position_swagger_output.json')))
app.use('/doc/project', swaggerUi.serveFiles(require('./project_swagger_output.json'), {}), swaggerUi.setup(require('./project_swagger_output.json')))
app.use('/doc/employee', swaggerUi.serveFiles(require('./employee_swagger_output.json'), {}), swaggerUi.setup(require('./employee_swagger_output.json')))
app.use('/doc/vaccine', swaggerUi.serveFiles(require('./vaccine_swagger_output.json'), {}), swaggerUi.setup(require('./vaccine_swagger_output.json')))

process.env.TZ = "Asia/Bangkok";
console.log(new Date().toString());
//routes import here
require('./app/routes/attendance.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/employee.routes')(app);
require('./app/routes/company.routes')(app);
require('./app/routes/department.routes')(app);
require('./app/routes/healthinfo.routes')(app);
require('./app/routes/position.routes')(app);
require('./app/routes/project.routes')(app);
require('./app/routes/image.routes')(app);
require('./app/routes/projectteam.routes')(app);
require('./app/routes/vaccine.routes')(app);
// set port, listen for requests
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
