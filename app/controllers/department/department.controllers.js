const department = require("../../models/department/department");
const authJwt = require("../../models/user/authentication");

// Get department
exports.departmentList = async (req, res) => {
  var listDepartment = "";
  listDepartment = await department.departmentList(req, res);
  console.log(listDepartment);
  if (listDepartment.length == 0) {
    res
      .status(200)
      .send({ code: "WEDP404", description: "Department Not found." });
  }
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEDP401", description: "Access Token Expired" });
  } else {
    res.status(200).send({
      total: listDepartment.length,
      department: listDepartment,
    });
  }
};

// Get company
exports.ckcompanyId = async (req, res, next) => {
  var listDepartment = "";
  listDepartment = await department.ckcompanyId(req, res);
  console.log(listDepartment);
  if (listDepartment.length == 0) {
    res
      .status(200)
      .send({ code: "WEDP404", description: "Company Not found." });
  }
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEDP401", description: "Access Token Expired" });
  } else {
    next();
  }
};

// Get department by Id
exports.departmentById = async (req, res) => {
  var DepartmentId = "";
  DepartmentId = await department.departmentByCompanyId(req, res);
  console.log(DepartmentId.length, DepartmentId);
  if (DepartmentId.length == 0) {
    res
      .status(200)
      .send({ code: "WEDP404", description: "Department Not found." });
  }
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEDP401", description: "Access Token Expired" });
  } else {
    res
      .status(200)
      .send({ total: DepartmentId.length, department: DepartmentId });
  }
};

// get by department_id
exports.departmentBydId = async (req, res) => {
  var DepartmentId = "";
  DepartmentId = await department.departmentBydepartmentId(req, res);
  console.log(DepartmentId.length);
  if (DepartmentId.length == 0) {
    res
      .status(200)
      .send({ code: "WEDP404", description: "Department Not found." });
  }
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEDP401", description: "Access Token Expired" });
  } else {
    res
      .status(200)
      .send({ total: DepartmentId.length, department: DepartmentId });
  }
};

// create department
exports.createDepartment = async (req, res) => {
  try {
    let departmentData = "";
    let companyCk = "";
    companyCk = await department.ckcompanyId(req, res);
    // departmentCk = await department.departmentByCompanyId(req, res);
    console.log("compa", companyCk, "comlength", companyCk.length);
    // console.log("depart",departmentCk);
    if (companyCk.length == 0) {
      res
        .status(200)
        .send({ code: "WEDP403", description: "Company not Found" });
    }
  } catch (error) {
    error = res
      .status(200)
      .send({ code: "WEDP403", description: "Company not Found" });
    return error;
  }
  if (!req.body.department_name) {
    res.status(400).send({
      Code: "WEDP400",
      description: "Department_name cannot Be Null.",
    });
  }
  departmentData = await department.createDepartment(req, res);
  console.log("creat", departmentData);
  if (req.body.department_id) {
    res
      .status(200)
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
        .status(200)
        .send({ code: "WEDP404", description: "Department not Found." });
    }

    res.status(200).send({ code: "WEDP200", description: "Success" });

    // if(!departmentData) {
    //   res.status(500).send({ Code: "500", description: "Error" })
    // } else {
    //   if (departmentData.hasOwnProperty('department_id')) {
    //     if (departmentData.department_id != 0) {
    //       res.status(200).send({ Code: "WEDP200", description: "Success" })
    //     } else {
    //       res.status(404).send({ Code: "WEDP404", message: "Department Id not Found." });
    //     }
    //   }
    // }
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

delete department;
exports.deleteDepartment = async (req, res) => {
  try {
    let departmentData = "";
    departmentCk = await department.departmentBydepartmentId(req, res);
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEDP401", description: "Access Token Expired" });
    }
    // console.log("ss test", departmentCk.length);
    if (departmentCk.length == 0) {
      res
        .status(200)
        .send({ code: "WEDP404", description: "Department not Found." });
    }
    if (!departmentCk.length == 0) {
      departmentData = await department.deleteDepartment(req, res);
      res
        .status(200)
        .send({ code: "WEDP404", description: "Department not Found." });
    }
    // console.log("ss testss", departmentData.length);
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};
