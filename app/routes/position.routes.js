const authJwt = require("../models/user/authentication");
const controller = require("../controllers/position/position.controller");
const position = require("../models/position/position");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/position", [authJwt.verifyToken], controller.positionList);

  app.get(
    "/position/:company_id",
    [authJwt.verifyToken],
    controller.positioncompanyList
  );

  app.post(
    "/position/:company_id",
    [
      authJwt.verifyToken,
      position.departmentidCheck,
      position.positionnameCheck,
    ],
    controller.createPosition
  );

  app.post(
    "/position/id/:position_id",
    [authJwt.verifyToken, position.departmentidCheck],
    controller.updatePosition
  );

  app.delete(
    "/position/id/:position_id",
    [authJwt.verifyToken, position.positionCheck],
    controller.deletePosition
  );
};
