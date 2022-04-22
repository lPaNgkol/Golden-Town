const employee = require("../../models/user/employee");

// Get employee by companyId id
exports.employeeList = async (req, res) => {
    var listEmployee = ""
    if(!req.body.company_id){
        res.status(400).send({ message: "Company_Id cannot Be Null." });
    }
    listEmployee = await employee.listEmployee(req, res)
    console.log(listEmployee)
    if (listEmployee.length==0) {
        res.status(404).send({ message: "Company Not found." });
    }else{
        res.status(200).send({"listEmployee": listEmployee, totalRow:listEmployee[0].total_row});
    }
  };

// Get employee by id
exports.employee = async (req, res) => {
    var employeeData = ""
    if(!req.params.user_id){
        res.status(400).send({ message: "User Id cannot Be Null." });
    }
    employeeData = await employee.getEmployee(req, res)
    if (employeeData.length==0) {
        res.status(404).send({ message: "Employee Not found." });
    }else{
        res.status(200).send({"employee": employeeData});
    }
};

// update employee by id
exports.employeeUpdate = async (req, res) => {
    var employeeData = ""
    if(!req.params.user_id){
        res.status(400).send({ message: "User Id cannot Be Null." });
    }
    employeeData = await employee.updateEmployee(req, res)
    if (employeeData.length==0) {
        res.status(404).send({ message: "Employee Not found." });
    }else{
        res.status(200).send({message: "Employee Update Complete"});
    }
};