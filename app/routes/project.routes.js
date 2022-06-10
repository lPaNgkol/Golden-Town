const authJwt = require("../models/user/authentication");
const controller = require("../controllers/project/project.controller");
const project = require("../models/project/project");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.post(
    "/project/:company_id",
    [authJwt.verifyToken, project.checkDuplicateProjectCode], 
    controller.createProject
  );
  
  app.post(
    "/project/update/:project_id",
    [authJwt.verifyToken, project.checkProjectExist, project.checkDuplicateProjectCode], 
    controller.updateProject
  );
  
  app.delete(
    "/project/:project_id",
    [authJwt.verifyToken, project.checkProjectExist], 
    controller.deleteProject
  );
  app.get(
    "/project/:company_id",
    [authJwt.verifyToken],
    controller.listProject
  );
};