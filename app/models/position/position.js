const db = require("../dbconnection");
var format = require('pg-format');
var moment = require('moment');

function positionList(req, res){
    return new Promise(function(resolve){
      let query = `SELECT a.position_id, a.position_name, a.department_id, b.department_name,
                  a.createby, a.updateby, a.updatedate, a.createdate
                  FROM positions a LEFT JOIN department b ON a.department_id = b.department_id WHERE a.active = $1`
                  
      let dataquery = ["T"];
      if(req.body.limit){
        query = query + " LIMIT $2"
        dataquery.push(req.body.limit)
      }
      if(req.body.offset){
        query = query + " OFFSET $3"
        dataquery.push(req.body.offset)
      }
      console.log(dataquery)

      db.query(query, dataquery).then((results) => {
        console.log(query)
        resolve(results.rows)
      })
      .catch(error => {
        res.status(500).send({
          message: error.message
        });
      });
    })
  }

  function createPosition(req, res){
    var time = moment();
    var dateNow = time.format('YYYY-MM-DD HH:mm:ss');    
    const position_name = req.body.position_name
    const department_id = req.body.department_id
    const active = "T"
    const createby = req.body.createby
    const createdate = dateNow
    return new Promise(function(resolve){
      const query = `INSERT INTO positions(position_name, department_id, active, createby, createdate) 
                     VALUES ($1, $2, $3, $4, $5)  RETURNING position_id;`
      const dataquery = [position_name, 
                         department_id,
                         active,
                         createby,
                         createdate];
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

const position = {
    positionList: positionList,
    createPosition: createPosition
};
module.exports = position;