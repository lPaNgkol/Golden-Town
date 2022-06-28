const { response } = require("express");
const department = require("../../models/department/department");
const authJwt = require("../../models/user/authentication");

// Get department
exports.departmentList = async (req, res) => {
  var listDepartment = "";
  listDepartment = await department.departmentList(req, res);
  // console.log(listDepartment);
  if (listDepartment.length == 0) {
    res
      .status(404)
      .send({ code: "WEDP404", description: "Department Not found." });
  } else {
    res.status(200).send({
      code: "WEDP200",
      total: listDepartment.length,
      department: listDepartment,
    });
  }
};

// Get company
exports.ckcompanyId = async (req, res, next) => {
  var listDepartment = "";
  listDepartment = await department.ckcompanyId(req, res);
  // console.log(listDepartment);
  if (listDepartment.length == 0) {
    res
      .status(404)
      .send({ code: "WEDP404", description: "Company Not found." });
  } else {
    next();
  }
};

// Get department by Id
exports.departmentById = async (req, res) => {
  var DepartmentId = "";
  DepartmentId = await department.departmentByCompanyId(req, res);
  // console.log(DepartmentId.length, DepartmentId);
  if (DepartmentId == 0) {
    res
      .status(200)
      .send({ code: "WEDP404", description: "No Department In Company." });
  } else {
    res
      .status(200)
      .send({ total: DepartmentId.length, department: DepartmentId });
  }
};

// get by department_id
exports.departmentBydId = async (req, res) => {
  var Dnnn = null;
  Dnnn = await department.dName(req, res);
  // console.log("dName", Dnnn);

  let DepartmentId = await department.departmentInfo(req, res);
  // console.log("DepartmentId", DepartmentId.length);

  // console.log("pos3", DepartmentId[0].employee_id);
  if (DepartmentId == 0) {
    res.status(200).send({
      code: "WEPT200",
      total: 0,
      department_name: Dnnn,
      department_user: [],
    });
  } else {
    res.status(200).send({
      code: "WEPT200",
      total: DepartmentId.length,
      department_name: Dnnn,
      department_user: DepartmentId,
    });
  }
};

// get by department_id
exports.departmentBycId = async (req, res) => {
  var DepartmentId = "";
  var Dnnn = null;
  DepartmentId = await department.companyInfo(req, res);
  // Dnnn = await department.dName(req, res);
  Dnnn = await department.fName(req, res);
  console.log("te", Dnnn);
  if (DepartmentId.length == 0) {
    res.status(200).send({
      department_name: Dnnn,
    });
  } else {
    res.status(200).send({
      total: DepartmentId.length,
      department_name: Dnnn,
      department_user: DepartmentId,
    });
  }
};

// create department
exports.createDepartment = async (req, res) => {
  try {
    let departmentData = "";
    let companyCk = "";
    companyCk = await department.ckcompanyId(req, res);

    if (companyCk.length == 0) {
      res
        .status(404)
        .send({ code: "WEDP404", description: "Company not Found" });
    }
  } catch (error) {
    error = res
      .status(404)
      .send({ code: "WEDP404", description: "Company not Found" });
    return error;
  }
  if (!req.body.department_name) {
    res.status(200).send({
      Code: "WEDP400",
      description: "Department_name cannot Be Null.",
    });
  }
  departmentData = await department.createDepartment(req, res);
  console.log("creat", departmentData);
  if (departmentData.length == 0) {
    res
      .status(404)
      .send({ code: "WEDP404", description: "Department not Found." });
  }
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEDP401", description: "Access Token Expired" });
  } else {
    res.status(200).send({ code: "WEDP200", description: "Success" });
    // department: departmentData
  }
};

// update department
exports.updateDepartment = async (req, res) => {
  try {
    var departmentData = null;

    if (!req.body.department_name) {
      res.status(400).send({
        code: "WEDP400",
        description: "Departmentname cannot Be Null.",
      });
    }
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEDP401", description: "Access Token Expired" });
    }
    departmentData = await department.updateDepartment(req, res);
    // console.log("departmentData", departmentData);
    if (!departmentData) {
      res
        .status(404)
        .send({ code: "WEDP404", description: "Department not Found." });
    }
    res.status(200).send({ code: "WEDP200", description: "Success" });
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

delete department;
exports.deleteDepartment = async (req, res) => {
  try {
    let departmentData = await department.deleteDepartment(req, res);
  console.log("is Complete!",departmentData);

    if (departmentData != "complete") {
      res
        .status(404)
        .send({ code: "WEDP404", description: "Department Id Not found." });
    } else {
      res.status(200).send({ code: "WEDP200", description: "Delete Complete!" });
    }
    // console.log("ss testss", departmentData.length);
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

exports.deleteCheck = async (req, res, next) => {
  // console.log("VC",vcCheck);
  if (!req.params.department_id) {
    res
      .status(200)
      .send({ code: "WEDP400", description: "Department Id Cannot be null" });
  }
  let dpCheck = await department.departmentBydepartmentId(req, res, next);
  console.log("dpcheck",dpCheck);
  if (dpCheck == 0) {
    res
      .status(404)
      .send({ code: "WEDP404", description: "Deparment ID Not Found" });
  } else {
    next();
  }
};
