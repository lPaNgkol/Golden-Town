const controller = require("../controllers/reserve/reserve.controller");
const reserve = require("../models/reserve/reserve");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get(
    "/reserve",
    controller.reserveList);

  app.get(
    "/reserve/admin",
    controller.reserveListAdmin);

  app.get(
    "/reserve/user/:user_id",
    controller.reserveListUserId);

  app.get(
    "/reserve/reserved/:reserve_id",
    controller.reserveListReserveId);

  app.post(
    "/reserve/:user_id/:reserve_id",
    [reserve.checkDuplicateReserve],
    controller.reserveCreate);

  app.post(
    "/reserve/:id",
    [reserve.checkIdExist],
    controller.reserveUpdate);
};