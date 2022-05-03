const authJwt = require("../models/user/authentication");
const employee = require("../models/user/employee");
const controller = require("../controllers/employee/employee.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get(
    "/employee",
    [authJwt.verifyToken],
    controller.employeeList
  );
  app.get('/employee/:user_id',
    [authJwt.verifyToken],
    controller.employee 
  );
  app.post("/employee/:user_id",
    [
      authJwt.verifyToken,
      employee.checkEmployeeExist,
      employee.checkDuplicateUsername,
      employee.checkDuplicateEmployeeId,
    ], 
    controller.employeeUpdate
  );
};