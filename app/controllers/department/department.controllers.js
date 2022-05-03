const department = require("../../models/department/department");
const authJwt = require("../../models/user/authentication");

// Get department
exports.departmentList = async (req, res) => {
  var listDepartment = "";

  listDepartment = await department.departmentList(req, res);
  console.log(listDepartment);
  if (listDepartment.length == 0) {
    res.status(404).send({ message: "Department Not found." });
  }
  if (!authJwt) {
    res.status(401).send({ message: "Access Token Expired" });
  } else {
    res.status(200).send({
      Total: listDepartment.length,
      Department: listDepartment,
    });
  }
};
// Get department by Id
exports.departmentById = async (req, res) => {
  var DepartmentId = "";
  DepartmentId = await department.departmentById(req, res);
  console.log(DepartmentId.length);
  if (DepartmentId.length == 0) {
    res.status(404).send({ message: "Department Not found." });
  }
  if (!authJwt) {
    res.status(401).send({ message: "Access Token Expired" });
  } else {
    res
      .status(200)
      .send({ Total: DepartmentId.length, Department: DepartmentId });
  }
};

// create department
exports.createDepartment = async (req, res) => {
  let departmentData;
  if (!req.body.department_name) {
    res
      .status(400)
      .send({ Code: "400", message: "department_name cannot Be Null." });
  }
  departmentData = await department.createDepartment(req, res);
  if (req.body.department_id) {
    res.status(404).send({ Code: "404", message: "Department Id not Found." });
  }
  if (!authJwt) {
    res.status(401).send({ Code: "401", message: "Access Token Expired" });
  } else {
    res.status(200).send({ Code: "200", massage: "Success" });
    departmentData;
  }
};

// update department
exports.updateDepartment = async (req, res) => {
  var departmentData = "";
  if (!req.body.department_name) {
    res.status(400).send({ message: "department_name cannot Be Null." });
  }
  if (!authJwt) {
    res.status(401).send({ message: "Access Token Expired" });
  }
  departmentData = await department.updateDepartment(req, res)
    if (!departmentData){
    res.status(404).send({ Code: "404", message: "Department Id not Found." });
  } else {
    console.log(req.params.department_id)
    res.status(200).send({ Code: "200", massage: "Success" })

  }
};

// delete department
exports.deleteDepartment = async (req, res) => {
  var departmentData = "";
  if (!req.params.department_id) {
    res.status(404).send({ message: "department_id not Found." });
  }

  if (!authJwt) {
    res.status(401).send({ message: "Access Token Expired" });
  } 
  else {  departmentData = await department.deleteDepartment(req, res)
    res.status(200).send({ message: "Success" })
    
  }
};
