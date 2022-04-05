const verifySignUp = require("../models/user/verifySignUp");
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
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsername
    ],
  );
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/refreshtoken", controller.refreshToken);
};