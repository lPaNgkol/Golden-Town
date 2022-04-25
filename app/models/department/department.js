const db = require("../dbconnection");
var format = require('pg-format');

function departmentList(req, res){
    return new Promise(function(resolve){
      let query = `SELECT * FROM department`
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

function createDepartment(req, res){
    var Date = new Date().toISOString().slice(0, 19);
    aDatetime = String(date).split("T")
    var dateNow = aDatetime[0] + " " + aDatetime[1]
    const department_name = req.body.department_name
    const createby = req.body.createby
    const createdate = dateNow
    const updateby = req.body.updateby
    const updatedate = dateNow
    return new Promise(function(resolve){
      const query = `INSERT INTO department(department_name, createby, createdate, updateby, updatedate) 
                     VALUES ($1, $2, $3, $4, $5) RETURNING department_id;`
      const dataquery = [department_name, 
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

  function updateDepartment(req, res){
    var date = new Date().toISOString().slice(0, 19);
    aDatetime = String(date).split("T")
    var dateNow = aDatetime[0] + " " + aDatetime[1]
    const department_name = req.body.departmentname
    const createby = req.body.createby
    const createdate = dateNow
    const updateby = req.body.updateby
    const updatedate = dateNow
    const department_id = req.params.department_id
    
    return new Promise(function(resolve){
      const query = `UPDATE department
                     SET department_name=$1, createby=$2, createdate=$3, updateby=$4, updatedate=$5,
                     WHERE UPPER(department_id) = UPPER($6) 
                     RETURNING department_id;`
      const dataquery = [department_name, 
                          createby,
        createdate,
        updateby,
        updatedate,
      department_id];
      db.query(query, dataquery).then((results) => {
        console.log(results.rows)
        resolve(results.rows[0])
      })
      .catch(error => {
        res.status(500).send({
          message: error.message
        });
      });
    })
  }

  function deleteDepartment(req, res){
        const id = parseInt(request.params.department_id)
        pool.query('DELETE FROM department WHERE department_id = $1', [id] = {
        })
          .catch(error => {
            res.status(500).send({
              message: error.message
            });
          });
      }


const department = {
  departmentList: departmentList,
  createDepartment: createDepartment,
  updateDepartment: updateDepartment,
  deleteDepartment: deleteDepartment,
};
module.exports = department;
