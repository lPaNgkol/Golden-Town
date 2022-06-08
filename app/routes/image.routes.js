const authJwt = require("../models/user/authentication");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/usr/src/upload/project/:project_code/:file_name', function (req, res) {
    var file_name = req.params.file_name
    var project_code = req.params.project_code
    let dir = __dirname.split("/app")[0]
    res.sendFile(dir + '/app/upload/project/'+ project_code + '/' + file_name)  
  })

  app.get('/usr/src/upload/user/:employee_id/:file_name', function (req, res) {
    var file_name = req.params.file_name
    var employee_id = req.params.employee_id
    let dir = __dirname.split("/app")[0]
    res.sendFile(dir + '/app/upload/user/'+ employee_id + '/' + file_name)  
  })
};