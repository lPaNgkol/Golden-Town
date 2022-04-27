const authJwt = require("../models/user/authentication");
const controller = require("../controllers/department/department.controllers");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get(
    "/department",
    [authJwt.verifyToken],
    controller.departmentList
  );

  app.get(
    "/department/:company_id",
    [authJwt.verifyToken],
    controller.departmentById
    );

  app.post("/department/:department_id",
    [authJwt.verifyToken],
    controller.createDepartment
  );
  app.put("/department/:department_id",
    [authJwt.verifyToken], 
    controller.updateDepartment
  );
  app.delete("/department/:department_id",
  [authJwt.verifyToken],
  controller.deleteDepartment)
};
