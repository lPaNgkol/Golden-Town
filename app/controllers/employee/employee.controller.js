const employee = require("../../models/user/employee");

// Get employee by companyId id
exports.employeeList = async (req, res) => {
    var listEmployee = ""
    if(!req.body.company_id){
        res.status(200).send({ code:"WEEM003", message: "Company_Id cannot Be Null." });
    }
    listEmployee = await employee.listEmployee(req, res)
    console.log(listEmployee)
    if (listEmployee.length==0) {
        res.status(404).send({code:"WEEM404", message: "Company Not found." });
    }else{
        res.status(200).send({code:"WEEM200", "listEmployee": listEmployee, totalRow:listEmployee[0].total_row});
    }
  };

// Get employee by id
exports.employee = async (req, res) => {
    var employeeData = ""
    if(!req.params.user_id){
        res.status(200).send({code:"WEEM004", message: "User Id cannot Be Null." });
    }
    employeeData = await employee.getEmployee(req, res)
    if (employeeData===undefined) {
        res.status(404).send({code:"WEEM404", message: "Employee Not found." });
    }else{
        res.status(200).send({code:"WEEM200", "employee": employeeData});
    }
};

// update employee by id
exports.employeeUpdate = async (req, res) => {
    var employeeData = ""
    if(!req.params.user_id){
        res.status(200).send({code:"WEEM004", message: "User Id cannot Be Null." });
    }
    employeeData = await employee.updateEmployee(req, res)
    if (employeeData.length==0) {
        res.status(404).send({code:"WEEM200", message: "Employee Not found." });
    }else{
        res.status(200).send({code:"WEEM200", message: "Employee Update Complete"});
    }
};