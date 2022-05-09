const db = require("../dbconnection");
var format = require("pg-format");
var moment = require("moment");

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
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEDP500",
        description: error.message,
      });
    }
  });
}

// get by companyId
function departmentByCompanyId(req, res) {
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
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEDP500",
        description: error.message,
      });
    }
  });
}

//gat by department_id
function departmentBydepartmentId(req, res) {
  return new Promise(async (resolve) => {
    try {
      let department_id = req.params.department_id;
      const data = await db.query(
        `SELECT department_id, department_name FROM department WHERE department_id = $1`,
        [department_id]
      );
      let results = data.rows;
      return resolve(results, results.length);
    } catch (error) {
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEDP500",
        description: error.message,
      });
    }
  });
}

// create
function createDepartment(req, res) {
  return new Promise(async function (resolve) {
    try {
      const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
      // const department_id = req.body.department_id;
      // console.log("req", req)
      const department_name = req.body.department_name;
      const company_id = req.params.company_id;
      const createby = req.user_id;
      const updateby = req.user_id;
      const createdate = dateNow;
      const updatedate = dateNow;
      let companyId = req.params.company_id;
  
      const datCk = await db.query(`SELECT company_id FROM department WHERE company_id = $1`,
      [companyId]);
      datareCk = datCk.rowCount != 0 ? datCk.rows[0] : false;

      const data = await db.query(
        `INSERT INTO department(department_name, company_id, createby, updateby, createdate, updatedate)
              VALUES ($1, $2, $3, $4, $5, $6) RETURNING department_id`,
        [
          department_name,
          company_id,
          createby,
          updateby,
          createdate,
          updatedate,
        ]
      );
      
      let results = data.rows;
      return resolve(results);
    } catch (error) {
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEDP500",
        description: error.message,
      });
    }
  });
}

//update
function updateDepartment(req, res) {
  return new Promise(async function (resolve) {
    try {
      const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
      const department_name = req.body.department_name;
      const company_id = req.body.company_id;
      const createby = req.user_id;
      const updateby = req.user_id;
      const createdate = dateNow;
      const updatedate = dateNow;
      const department_id = req.params.department_id;
      const data = await db.query(
        `UPDATE department SET department_name=$1, updateby=$3, updatedate=$4
                     WHERE department_id=$2
                     RETURNING department_id;`,
        [department_name, department_id, updateby, updatedate]
      );
      // console.log("dd", department_name,department_id,updateby,updatedate);
      let results = data.rowCount != 0 ? data.rows[0] : false;
      return resolve(results);
    } catch (error) {
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEDP500",
        description: error.message,
      });
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
      // console.log("testresults", reeS.length);
      return resolve(results, results.length);
    } catch (error) {
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEDP500",
        description: error.message,
      });
    }
  });
}

const department = {
  departmentList: departmentList,
  departmentByCompanyId: departmentByCompanyId,
  departmentBydepartmentId: departmentBydepartmentId,
  createDepartment: createDepartment,
  updateDepartment: updateDepartment,
  deleteDepartment: deleteDepartment,
};
module.exports = department;
