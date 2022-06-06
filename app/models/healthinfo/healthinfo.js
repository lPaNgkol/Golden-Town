const db = require("../dbconnection");
var format = require('pg-format');
var moment = require('moment');

function healthinfoList(req, res){
    return new Promise(function(resolve){
      let query = `SELECT a.healthinfo_id, a.note, a.user_id, a.createby, a.createdate,a.updateby, a.updatedate,
                          b.firstname, b.lastname, b.nickname, b.employee_id
                          FROM health_info a JOIN users b ON a.user_id = b.user_id WHERE a.active = $1`
                          
      let dataquery = ["T"];
      if(req.body.limit){
        query = query + " LIMIT $2"
        dataquery.push(req.body.limit)
      }
      if(req.body.offset){
        query = query + " OFFSET $3"
        dataquery.push(req.body.offset)
      }
      console.log (dataquery)

      db.query(query, dataquery).then((results) => {
        console.log (query)
        resolve(results.rows)
      })
      .catch(error => {
        res.status(500).send({
          message: error.message
        });
      });
    })
  }

function createHealthinfo(req, res){
    var time = moment();
    var dateNow = time.format('YYYY-MM-DD HH:mm:ss');
    const user_id = req.body.user_id
    const createby = req.body.createby
    const active = "T"
    const note = req.body.note
    const createdate = dateNow
    return new Promise(function(resolve){
      const query = `INSERT INTO health_info(user_id, createby, active, note, createdate) 
                     VALUES ($1, $2, $3, $4, $5)  RETURNING healthinfo_id;`
      const dataquery = [user_id, 
                         createby,
                         active,
                         note,
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

const healthinfo = {
    healthinfoList: healthinfoList,
    createHealthinfo: createHealthinfo
};
module.exports = healthinfo;