const authJwt = require("../models/user/authentication");
const controller = require("../controllers/healthinfo/vaccine.controller");
const vaccine = require("../models/healthinfo/vaccine")

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/vaccine/", [authJwt.verifyToken],
   controller.vaccinelist);

  app.get(
    "/vaccine/:company_id",
    [authJwt.verifyToken],
    controller.vaccinelistbycompanyId
  );
  app.get(
    "/vaccine/id/:user_id",
    [authJwt.verifyToken],
    controller.vaccinelistbyuserId
  );
  app.post(
    "/vaccine/:user_id",
    [authJwt.verifyToken, vaccine.doseCheck],
    controller.createvaccine
  );

  app.post(
    "/vaccine/:user_id/:vaccine_info_id",
    [authJwt.verifyToken],
    controller.updatevaccine
  );

  app.delete(
    "/vaccine/:user_id/:vaccine_info_id",
    [authJwt.verifyToken, vaccine.deleteCheck],
    controller.deletevaccine
  );
};
