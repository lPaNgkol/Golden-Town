const employee = require("../models/user/employee");
const authJwt = require("../models/user/authentication");
const controller = require("../controllers/user/user.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/employee",
    [
      authJwt.verifyToken,
      employee.checkDuplicateUsername,
      employee.checkDuplicateEmployeeId,
      employee.checkRolesExisted
    ],
    controller.signup
  );
  app.post("/users/login", controller.signin);
  app.post("/users/logout", controller.logout);
  app.post("/auth/refreshtoken",
    [authJwt.verifyToken], 
    controller.refreshToken
  );
};