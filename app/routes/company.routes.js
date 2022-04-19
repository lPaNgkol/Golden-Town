const authJwt = require("../models/user/authentication");
const controller = require("../controllers/company/company.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  //list company
  app.get(
    "/company",
    [authJwt.verifyToken],
    controller.companyList
  );
  //get company by id
//   app.get('/company/:company_id',
//     [authJwt.verifyToken],
//     controller.employee 
//   );
  //add new company
  app.post("/company",
    [authJwt.verifyToken], 
    controller.createCompany
  );
  //edit company
//   app.post("/company/:company_id",
//     [authJwt.verifyToken], 
//     controller.employeeUpdate
//   );
};