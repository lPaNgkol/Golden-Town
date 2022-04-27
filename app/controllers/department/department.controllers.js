const department = require("../../models/department/department");

// Get department
exports.departmentList = async (req, res) => {
    var listDepartment = ""
    listDepartment = await department.departmentList(req, res)
    console.log(listDepartment)
    if (listDepartment.length==0) {
        res.status(404).send({ message: "Department Not found." });
    }else{
        res.status(200).send({"listDepartment": listDepartment});
    }
  };

  // Get department by Id
  exports.departmentById = async (req, res) => {
    var DepartmentId = ""
    DepartmentId = await department.departmentById(req, res)
    console.log(DepartmentId)
    if (DepartmentId.length==0) {
        res.status(404).send({ message: "Department Not found." });
    }else{
        res.status(200).send({"DepartmentId": DepartmentId});
    }
  };

// create department
exports.createDepartment = async (req, res) => {
    var departmentData = ""
    if(!req.body.department_name){
        res.status(400).send({ message: "department_name cannot Be Null." });
    }
    departmentData = await department.createDepartment(req, res)
    if (departmentData.length==0) {
        res.status(404).send({ message: "department Not found." });
    }else{
        res.status(200).send({massage: "Department Update Complete", departmentData});
    }
};



// update department
exports.updateDepartment = async (req, res) => {
    var departmentData = ""
    if(!req.params.department_id){
        res.status(400).send({ message: "Department Id cannot Be Null." });
    }
    departmentData = await department.updateDepartment(req, res)
    if (departmentData.length==0) {
        res.status(404).send({ message: "Department Not found." });
    }else{
        res.status(200).send({message: "Department Update Complete"});
    }
};


// delete department
exports.deleteDepartment = async (req, res) => {
    var departmentData = ""
    if(!req.params.department_id){
        res.status(400).send({ message: "Department Id cannot Be Null." });
    }
    departmentData = await department.deleteDepartment(req, res)
    if (departmentData.length==0) {
        res.status(404).send({ message: "Department ID Not Found." });
    }else{
        res.status(200).send({message: "Success"});
    }
};
