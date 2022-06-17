const companyModel = require("../models/company/company");
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
  app.get(
    "/company",
    [authJwt.verifyToken],
    controller.companyList
  );
  app.get('/company/:company_id',
    [authJwt.verifyToken, companyModel.checkCompanyExist],
    controller.getCompanyById 
  );
  app.post("/company",
    [authJwt.verifyToken,companyModel.checkDuplicateCompanyName], 
    controller.createCompany
  );
  app.delete('/company/:company_id',
    [authJwt.verifyToken, companyModel.checkCompanyExist],
    controller.deleteCompany 
  );
  app.post("/company/:company_id",
    [authJwt.verifyToken, companyModel.checkCompanyExist, companyModel.checkDuplicateCompanyName], 
    controller.updateCompany
  );
};