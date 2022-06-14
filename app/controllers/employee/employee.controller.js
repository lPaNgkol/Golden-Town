const employee = require("../../models/user/employee");
let fs = require('fs');

// Get employee by companyId id
exports.employeeList = async (req, res) => {
    var listEmployee = ""
    if(!req.body.company_id){
        res.status(200).send({ code:"WEEM003", description: "Company_Id cannot Be Null." });
    }
    listEmployee = await employee.listEmployee(req, res)
    console.log(listEmployee)
    if (listEmployee.length==0) {
        res.status(404).send({code:"WEEM404", description: "Company Not found." });
    }else{
        res.status(200).send({code:"WEEM200", "listEmployee": listEmployee, totalRow:listEmployee[0].total_row});
    }
  };

// Get employee by id
exports.employee = async (req, res) => {
    var employeeData = ""
    if(!req.params.user_id){
        res.status(200).send({code:"WEEM004", description: "User Id cannot Be Null." });
    }
    employeeData = await employee.getEmployee(req, res)
    if (employeeData===undefined) {
        res.status(404).send({code:"WEEM404", description: "Employee Not found." });
    }else{
        res.status(200).send({code:"WEEM200", "employee": employeeData});
    }
};

// update employee by id
exports.employeeUpdate = async (req, res) => {
    var employeeData = ""
    if(!req.params.user_id){
        res.status(200).send({code:"WEEM004", description: "User Id cannot Be Null." });
    }

    if (req.files) {
        const file = req.files.image_url
        const fileName = file.name
        let dir = __dirname.split("/app")[0]
        fs.mkdir(`./upload/user/${req.body.employee_id}`, {recursive: true}, (err) => {
            if (err) {
                console.error(err);
            }else{

                file.mv(`./upload/user/${req.body.employee_id}/${fileName}`, async (err) => {
                    req.body.image_url = `${dir}/upload/user/${req.body.employee_id}/${fileName}`

                    
                    employeeData = await employee.updateEmployee(req, res)
                    if (employeeData.length==0) {
                        res.status(404).send({code:"WEEM200", description: "Employee Not found." });
                    }else{
                        res.status(200).send({code:"WEEM200", description: "Employee Update Complete"});
                    }
                })
            }
            console.log('Directory created successfully!');
        });
    }else{
        employeeData = await employee.updateEmployee(req, res)
        if (employeeData.length==0) {
            res.status(404).send({code:"WEEM200", description: "Employee Not found." });
        }else{
            res.status(200).send({code:"WEEM200", description: "Employee Update Complete"});
        }
    }
};

exports.deleteEmployee = async (req, res) => {
    var employeeData = ""
    if(!req.params.user_id){
        res.status(200).send({code:"WEEM400", description: "User id cannot be Null." });
    }
    employeeData = await project.deleteEmployee(req, res)
    console.log(employeeData);
    if (employeeData!="complete") {
        res.status(404).send({code:"WEEM404", description: "Company Id Not found." });
    }else{
        res.status(200).send({code:"WEEM200", description: "Delete Complete!"});
    }
};