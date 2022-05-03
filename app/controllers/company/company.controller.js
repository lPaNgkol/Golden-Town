const company = require("../../models/company/company");

// Get company List
exports.companyList = async (req, res) => {
    var listCompany = ""
    listCompany = await company.companyList(req, res)
    console.log(listCompany)
    if (listCompany.length==0) {
        res.status(404).send({code:"WECO404", message: "Company Id Not found." });
    }else{
        res.status(200).send({code:"WECO200", "listCompany": listCompany, totalRow:listCompany[0].total_row});
    }
  };

// create company
exports.createCompany = async (req, res) => {
    var companyData = ""
    if(!req.body.company_name){
        res.status(200).send({code:"WECO002", message: "Company name cannot be Null." });
    }
    companyData = await company.createCompany(req, res)
    if (companyData.length==0) {
        res.status(404).send({code:"WECO404", message: "Company Id Not found." });
    }else{
        res.status(200).send({code:"WECO200", companyData});
    }
};

// update employee by id
// exports.companyUpdate = async (req, res) => {
//     var employeeData = ""
//     if(!req.params.employee_id){
//         res.status(400).send({ message: "Employee Id cannot Be Null." });
//     }
//     employeeData = await employee.updateEmployee(req, res)
//     if (employeeData.length==0) {
//         res.status(404).send({ message: "Employee Not found." });
//     }else{
//         res.status(200).send({message: "Employee Update Complete"});
//     }
// };