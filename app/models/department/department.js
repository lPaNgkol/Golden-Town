const db = require("../dbconnection");
var format = require("pg-format");
var moment = require("moment");
const { render } = require("express/lib/response");

// get all
function departmentList(req, res) {
  return new Promise(async (resolve) => {
    try {
      const data = await db.query(
        `SELECT * FROM department ORDER BY department_id ASC`
      );
      console.log(data);
      let results = data.rows;

      return resolve(results);
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  });
}

// get by companyId
function departmentById(req, res) {
  return new Promise(async (resolve) => {
    try {
      let companyId = req.params.company_id;
      const data = await db.query(
        `SELECT department_id, department_name FROM department WHERE company_id = $1 ORDER BY department_id ASC`,
        [companyId]
      );
      let results = data.rows;
      return resolve(results, results.length);
    } catch (error) {
      console.error(error);
      return resolve(error);
    }
  });
}

// create
function createDepartment(req, res) {
  return new Promise(function (resolve) {
    try {
      var time = moment();
      var date = time.format("YYYY-MM-DDTHH:mm:ss");
      aDatetime = String(date).split("T");
      var dateNow = aDatetime[0] + " " + aDatetime[1];
      const department_id = req.body.department_id;
      const department_name = req.body.department_name;
      const company_id = req.body.company_id;
      const createby = req.body.createby;
      const updateby = req.body.updateby;
      const createdate = dateNow;
      const updatedate = dateNow;
      const data = db.query(
        `INSERT INTO department(department_name, company_id, createby, updateby, createdate, updatedate)
              VALUES ($1, 1, 1, 1, current_timestamp, current_timestamp) RETURNING department_id`,
        [
          department_name,

        ]
      );

      let results = data.rows;
      return resolve(results);
    } catch (error) {
      console.error("### Error ", error);
      return resolve(error);
    }
  });
}

//update
function updateDepartment(req, res) {
  return new Promise(function (resolve) {
    try {
      var time = moment();
      var date = time.format("YYYY-MM-DDTHH:mm:ss");
      aDatetime = String(date).split("T");
      var dateNow = aDatetime[0] + " " + aDatetime[1];
      const department_name = req.body.department_name;
      const company_id = req.body.company_id;
      const createby = req.body.createby;
      const updateby = req.body.updateby;
      const createdate = dateNow;
      const updatedate = dateNow;
      const department_id = req.params.department_id;
      const data = db.query(
        `UPDATE department SET department_name=$1, updateby=1, updatedate=current_timestamp
                     WHERE department_id=$2`,
        [
          department_name,
          department_id
        ]
      );
      let results = data.rows;
      return resolve(results);
    } catch (error) {
      console.error("### Error ", error);
      return resolve(error);
    }
  });
}

//delete
function deleteDepartment(req, res) {
  return new Promise(async (resolve) => {
    try {
      const result = await db.query(
        "DELETE FROM department WHERE department_id=$1",
        [req.params.department_id]
      );
      let results = result.rows;
      return resolve(results, "Deleted success");
    } catch (err) {
      return err, "error";
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
