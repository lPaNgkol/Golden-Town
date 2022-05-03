const db = require("../dbconnection");

checkDuplicateCompanyName = (req, res, next) => {
    const query = "SELECT * FROM response_code WHERE active=$1"
    const dataquery = [req.body.company_name, "T"];
    db.query(query, dataquery).then((results) => {
        if(results.rows.length>0){
            var ret = {"code":"WECO001", "description":"Company name already in use"}
            res.status(200).json(ret)
        }else{
            next();
        }
    }).catch(error => {
        res.status(500).send({
            code:"WECO500",
            description: error.message
        });
    });
};

const company = {
    companyList: companyList,
    createCompany: createCompany,
    checkDuplicateCompanyName:checkDuplicateCompanyName
};
module.exports = company;