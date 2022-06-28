const authJwt = require("../models/user/authentication");
const controller = require("../controllers/department/department.controllers");
const department = require("../models/department/department");



module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // getDepartmentByCompanyId
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


  // getDepartmentInfo
  app.get(
    "/departmentinfo/:department_id",
    [authJwt.verifyToken],
    controller.departmentBydId
  );
 // getCompanyInfo
  app.get(
    "/companyinfo/:company_id",
    [authJwt.verifyToken],
    controller.departmentBycId
  );



  app.post("/department/:company_id",[authJwt.verifyToken],
    controller.ckcompanyId,
    controller.createDepartment
  );
  app.post("/department/id/:department_id",
    [authJwt.verifyToken],
    controller.updateDepartment
  );
  app.delete("/department/:department_id",
    [authJwt.verifyToken, controller.deleteCheck],
    controller.deleteDepartment
  )
};
