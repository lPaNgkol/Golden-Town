const authJwt = require("../models/user/authentication");
const controller = require("../controllers/project/projectteam.controllers");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/project/team/:company_id",
    [authJwt.verifyToken],
    controller.getProjectbyCompany
  );

  app.get(
    "/project/team/",
    [authJwt.verifyToken],
    controller.listProjectTeamAll
  );

  app.get(
    "/project/team/id/:project_team_id",
    [authJwt.verifyToken],
    controller.listProjectteam
  );

  app.post("/project/team/:project_on_hand_id",
  [authJwt.verifyToken],
  controller.createProjectTeam)


  app.put(
    "/project/team/:project_team_id",
    [authJwt.verifyToken],
    controller.updateProjectteam
  );

  app.delete(
    "/project/team/:project_team_id",
    [authJwt.verifyToken],
    controller.deleteProjectteam
  );
};
