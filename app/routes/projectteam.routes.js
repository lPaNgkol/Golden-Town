const authJwt = require("../models/user/authentication");
const controller = require("../controllers/project/projectteam.controllers");
const projectteam = require("../models/project/projectteam");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get(
    "/projectteam/team/:company_id",
    [authJwt.verifyToken],
    controller.getProjectbyCompany
  );

  app.get(
    "/projectteam/team/id/:project_on_hand_id",
    [authJwt.verifyToken],
    controller.listProjectteam
  );

  app.post(
    "/projectteam/team",
    [
      authJwt.verifyToken,
      projectteam.checkuserId,
      projectteam.checkonhandId,
      projectteam.checkduplicateId,
    ],
    controller.createProjectTeam
  );

  app.post(
    "/projectteam/team/:project_on_hand_id",
    [authJwt.verifyToken, projectteam.checkduplicateId],
    controller.updateProjectteam
  );

  app.delete(
    "/projectteam/team/:project_on_hand_id",
    [authJwt.verifyToken, projectteam.ckdeleteProjectTeam],
    controller.deleteProjectteam
  );
};
