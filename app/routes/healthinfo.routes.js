const authJwt = require("../models/user/authentication");
const controller = require("../controllers/healthinfo/healthinfo.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get(
    "/health",
    [authJwt.verifyToken],
    controller.healthinfoList
  );

  app.post(
    "/health",
    [authJwt.verifyToken], 
    controller.createHealthinfo
  );
};