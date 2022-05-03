const db = require("../dbconnection");
var format = require('pg-format');
var moment = require('moment');

checkDuplicateCompanyName = (req, res, next) => {
    const query = "SELECT * FROM company WHERE company_name=$1 AND active=$2 ORDER BY company_id DESC"
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

function companyList(req, res){
    return new Promise(function(resolve){
      let query = `SELECT * FROM company WHERE active=$1`
      let dataquery = ["T"];
      if(req.body.limit){
        query = query + " LIMIT $2"
        dataquery.push(req.body.limit)
      }
      if(req.body.offset){
        query = query + " OFFSET $3"
        dataquery.push(req.body.offset)
      }
      db.query(query, dataquery).then((results) => {
        resolve(results.rows)
      })
      .catch(error => {
        res.status(500).send({
          code:"WECO500",
          description: error.message
        });
      });
    })
  }

function createCompany(req, res){
    var time = moment();
    var date = time.format('YYYY-MM-DDTHH:mm:ss');
    aDatetime = String(date).split("T")
    var dateNow = aDatetime[0] + " " + aDatetime[1]
    const company_name = req.body.company_name
    const address = req.body.address
    const active = "T"
    const createby = req.body.createby
    const createdate = dateNow
    const updateby = req.body.updateby
    const updatedate = dateNow
    return new Promise(function(resolve){
      const query = `INSERT INTO company(company_name, address, active, createby, createdate, updateby, updatedate) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7)  RETURNING company_id;`
      const dataquery = [company_name, 
        address,
                         active,
                         createby,
                         createdate,
                         updateby,
                         updatedate];
      db.query(query, dataquery).then((results) => {
        resolve(results.rows)
      })
      .catch(error => {
        res.status(500).send({
          code:"WECO500",
          description: error.message
        });
      });
    })
  }

const company = {
    companyList: companyList,
    createCompany: createCompany,
    checkDuplicateCompanyName:checkDuplicateCompanyName
};
module.exports = company;