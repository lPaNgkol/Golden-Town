const controller = require("../controllers/user/user.controller");
const user = require("../models/user/user");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/user/login",
    controller.userLogin);

  app.post(
    "/user/email",
    controller.userEmail);

  app.post(
    "/user/password",
    controller.userOTP);

  app.get(
    "/user",
    controller.userList);

  app.get(
    "/user/:user_id",
    controller.userListUserId);

  app.post(
    "/user",
    [
      user.checkDuplicateUsername,
      user.checkDuplicateEmail,
    ],
    controller.userCreate);

  app.post(
    "/user/:user_id",
    [user.checkUserExist],
    controller.userUpdate);

  app.post(
    "/user/reset_password/:user_id",
    [user.checkUserExist],
    controller.userUpdatePassword);
};