const authJwt = require("../models/user/authentication");
const controller = require("../controllers/position/position.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
app.get(
    "/position",
    [authJwt.verifyToken],
    controller.positionList
  );

  app.post(
    "/position",
    [authJwt.verifyToken], 
    controller.createPosition
  );
};