const db = require("../dbconnection");
var format = require('pg-format');

function departmentList(req, res) {
  return new Promise(async (resolve) => {
    try {
      const data = await db.query(
        `SELECT * FROM department ORDER BY department_id ASC`
      );
      let results = data.rows;
      return resolve(results);
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  });
}

function departmentById(req, res) {
  return new Promise(async (resolve) => {
    try {
      let companyId = req.params.company_id;
      const data = await db.query(
        `SELECT department_id, department_name FROM department WHERE company_id = $1 ORDER BY department_id ASC`,
        [companyId]
      );
      let results = data.rows;
      return resolve(results);
    } catch (error) {
      console.error("### Error ", error);
      return resolve(error);
    }
  });
}

function createDepartment(req, res) {

      return new Promise(async (resolve) => {
        try {
          aDatetime = String(Date).split("T")
          var dateNow = aDatetime[0] + " " + aDatetime[1]
          const department_name = req.body.department_name;
          const createby = req.body.createby;
          const createdate = dateNow;
          const updateby = req.body.updateby;
          const updatedate = dateNow;
          const data = await db.query(
            `INSERT INTO department(department_name, createby, createdate, updateby, updatedate) 
            VALUES ($1, $2, $3, $4, $5) RETURNING department_id`,
            [department_name,
              createby,
              createdate,
              updateby,
              updatedate,]
          );
          let results = data.rows;
          return resolve(results);
        } catch (error) {
          console.error("### Error ", error);
          return resolve(error);
        }
      });
    }

   function updateDepartment(req, res) {
  var time = moment();
  var date = time.format('YYYY-MM-DDTHH:mm:ss');
  aDatetime = String(date).split("T")
  var dateNow = aDatetime[0] + " " + aDatetime[1]
  const department_name = req.body.departmentname;

  const updateby = req.body.updateby;
  const updatedate = dateNow;
  const department_id = req.params.department_id;

  return new Promise(function (resolve) {
    const query = `UPDATE department
                     SET department_name=$1, updateby=$2, updatedate=$3,
                     WHERE UPPER(department_id) = UPPER($4) 
                     RETURNING department_id;`;
    const dataquery = [department_name, updateby, updatedate, department_id];
    db.query(query, dataquery)
      .then((results) => {
        console.log(results.rows);
        resolve(results.rows[0]);
      })
      .catch((error) => {
        res.status(500).send({
          message: error.message,
        });
      });
  });
}

 function deleteDepartment(req, res) {
  return new Promise(async (resolve) => {
    try {
      let deleteDepartment = req.param.department_id;
      const data = await db.query(`DELETE FROM department WHERE department_id = ${deleteDepart}`, [deleteDepart]);
      let results = data.rows;
    }
    catch (error) {
      console.error("### Error ", error);
      return resolve(error);
    }
  });
}

const department = {
  departmentList: departmentList,
  departmentById: departmentById,
  createDepartment: createDepartment,
  updateDepartment: updateDepartment,
  deleteDepartment: deleteDepartment,
};
module.exports = department;
