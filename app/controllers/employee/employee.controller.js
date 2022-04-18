const employee = require("../../models/user/employee");

exports.employeeList = async (req, res) => {
    var listEmployee = ""
    if(!req.body.company_id){
        res.status(400).send({ message: "Company_Id cannot Be Null." });
    }
    listEmployee = await employee.listEmployee(req, res)
    console.log(listEmployee)
    if (listEmployee.length==0) {
        res.status(404).send({ message: "Employee Not found." });
    }else{
        res.status(200).send({"listEmployee": listEmployee, totalRow:listEmployee[0].total_row});
    }
  };
exports.employee = async (req, res) => {
    var employeeData = ""
    if(!req.params.employee_id){
        res.status(400).send({ message: "Employee Id cannot Be Null." });
    }
    employeeData = await employee.getEmployee(req, res)
    if (listEmployee.length==0) {
        res.status(404).send({ message: "Employee Not found." });
    }else{
        res.status(200).send({"employee": employeeData});
    }
};