const db = require("../dbconnection");
var format = require('pg-format');

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
          message: error.message
        });
      });
    })
  }

function createCompany(req, res){
    var date = new Date().toISOString().slice(0, 19);
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
          message: error.message
        });
      });
    })
  }

const company = {
    companyList: companyList,
    createCompany: createCompany
};
module.exports = company;