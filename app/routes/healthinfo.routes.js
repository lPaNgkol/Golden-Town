const authJwt = require("../models/user/authentication");
const controller = require("../controllers/healthinfo/healthinfo.controller");
const healthinfo = require("../models/healthinfo/healthinfo");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/health", [authJwt.verifyToken], controller.healthinfoList);
  app.get(
    "/health/:user_id",
    [authJwt.verifyToken],
    controller.healthinfoByuserId
  );
  app.post(
    "/health/:user_id",
    [authJwt.verifyToken],
    controller.useridCheck,
    controller.createHealthinfo
  );

  app.put(
    "/health/:healthinfo_id/:user_id",
    [authJwt.verifyToken],
    controller.updateHealthinfo
  );

  app.delete(
    "/health/:healthinfo_id",
    [authJwt.verifyToken, healthinfo.userhealthidCheck],
    controller.deleteHealthinfo
  );
};
