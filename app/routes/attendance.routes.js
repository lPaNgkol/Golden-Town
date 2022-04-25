const authJwt = require("../models/user/authentication");
const controller = require("../controllers/attendance/attendance.controller");
const attendanceModel = require("../models/attendance/attendance");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/attendance/",
    [authJwt.verifyToken], 
    controller.attendanceList
  );
  app.post("/attendance/checkin/:user_id",
    [authJwt.verifyToken], 
    controller.checkin
  );
  app.post("/attendance/checkout/:user_id",
    [
      authJwt.verifyToken,
      attendanceModel.checkHasCheckin
    ], 
    controller.checkout
  );
};