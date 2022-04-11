const employee = require("../../models/user/employee");

exports.employeeList = async (req, res) => {
    var listEmployee = ""
    if(!req.body.company_id){
        res.status(400).send({ message: "Company Id cannot Be Null." });
    }
    listEmployee = await employee.listEmployee(req, res)
    if (!listEmployee) {
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
    if (!employeeData) {
        res.status(404).send({ message: "Employee Not found." });
    }else{
        res.status(200).send({"employee": employeeData});
    }
};