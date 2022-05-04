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
      total: listDepartment.length,
      department: listDepartment,
    });
  }
};
// Get department by Id
exports.departmentById = async (req, res) => {
  var DepartmentId = "";
  DepartmentId = await department.departmentByCompanyId(req, res);
  console.log(DepartmentId.length, DepartmentId);
  if (DepartmentId.length == 0) {
    res.status(404).send({ message: "Department Not found." });
  }
  if (!authJwt) {
    res.status(401).send({ message: "Access Token Expired" });
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
    res.status(404).send({ message: "Department Not found." });
  }
  if (!authJwt) {
    res.status(401).send({ message: "Access Token Expired" });
  } else {
    res
      .status(200)
      .send({ total: DepartmentId.length, department: DepartmentId });
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
    res.status(401).send({ code: "401", message: "Access Token Expired" });
  } else {
    res.status(200).send({ code: "200", massage: "Success" });
    // department: departmentData
  }
};

// update department
exports.updateDepartment = async (req, res) => {
  try {
    var departmentData = null;
    if (!req.body.department_name) {
      res.status(400).send({ message: "department_name cannot Be Null." });
    }
    if (!authJwt) {
      res.status(401).send({ message: "Access Token Expired" });
    }
    departmentData = await department.updateDepartment(req, res);
    // console.log("departmentData", departmentData);

    if (!departmentData) {
      res
        .status(404)
        .send({ code: "404", message: "Department Id not Found." });
    }

    res.status(200).send({ code: "200", massage: "Success" });

    // if(!departmentData) {
    //   res.status(500).send({ Code: "500", massage: "Error" })
    // } else {
    //   if (departmentData.hasOwnProperty('department_id')) {
    //     if (departmentData.department_id != 0) {
    //       res.status(200).send({ Code: "200", massage: "Success" })
    //     } else {
    //       res.status(404).send({ Code: "404", message: "Department Id not Found." });
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
      res.status(401).send({ message: "Access Token Expired" });
    }
    console.log("ss test", departmentCk.length);
    if (departmentCk.length == 0) {
      res.status(404).send({ message: "department_id not Found." });
    }
    if (!departmentCk.length == 0) {
      departmentData = await department.deleteDepartment(req, res);
      res.status(200).send({ message: "Success" });
    }
    // console.log("ss testss", departmentData.length);
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};
