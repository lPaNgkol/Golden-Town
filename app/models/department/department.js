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

//get companyId
function companyList(req, res) {
  return new Promise(async (resolve) => {
    try {
      let companyId = req.params.company_id;
      const data = await db.query(
        // `SELECT department_id, department_name FROM department WHERE company_id = $1 ORDER BY department_id ASC`,
        `SELECT * FROM company WHERE company_id=$1`,
        [companyId]
      );
      console.log("testdata", companyId);
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

// get by companyId
function departmentByCompanyId(req, res) {
  return new Promise(async (resolve) => {
    try {
      let companyId = req.params.company_id;
      const data = await db.query(
        // `SELECT department_id, department_name FROM department WHERE company_id = $1 ORDER BY department_id ASC`,
        `SELECT company_id, department_name FROM department WHERE company_id = $1 ORDER BY department_id ASC`,
        [companyId]
      );

      console.log("testdata", companyId);
      // let jdata = joindata.rows;
      let results = data.rows;

      return resolve(results, results.length);
      // return resolve(position, position.length);
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

function departmentName(req, res) {
  return new Promise(async (resolve) => {
    try {
      let departmentId = req.params.department_id;
      const poSer = await db.query(
        `SELECT department.department_name from department INNER JOIN user ON department.department_id = $1`,
        [departmentId]
      );
      let pos1 = poSer.rows[0].department_name;
      // let puSers = poSer.rows;
      console.log("tes", pos1);
      // console.log("pos1", puSers.rows);
      return resolve(pos1);
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

function departmentfName(req, res) {
  return new Promise(async (resolve) => {
    try {
      let departmentId = req.params.company_id;
      const poSer = await db.query(
        `SELECT company.company_name from company INNER JOIN user ON company.company_id = $1`,
        [departmentId]
      );
      let pos1 = poSer.rows[0].company_name;
      let puSers = poSer.rows;
      console.log("fname", pos1);
      console.log("pos1", puSers.rows);
      return resolve(pos1);
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
// get companyInfo
function companyInfo(req, res) {
  return new Promise(async (resolve) => {
    try {
      let companyId = req.params.company_id;

      const join207 = await db.query(
        `SELECT department.department_name, users.employee_id,users.user_id, users.firstname, users.lastname, users.nickname,users.imageurl, positions.position_id, positions.position_name
        FROM
        (department LEFT JOIN users ON users.department_id = department.department_id)
        LEFT JOIN positions ON users.position_id = positions.position_id WHERE EXISTS (SELECT users.company_id FROM users WHERE users.company_id = department.company_id AND users.company_id = $1) ORDER BY department.department_name;`,
        [companyId]
      );
      let position = join207.rows;
      let position1 = join207.rows[0].department_name;
      return resolve(position, position1);
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

// get departmentinfo
function departmentInfo(req, res) {
  return new Promise(async (resolve) => {
    try {
      let departmentId = req.params.department_id;
      const jointreedata = await db.query(
        `SELECT users.employee_id,users.user_id, users.firstname, users.lastname, users.nickname, positions.position_id, users.imageurl, positions.position_name
FROM
(department LEFT JOIN users ON users.department_id = $1)
INNER JOIN user ON department.department_id = users.department_id
LEFT JOIN positions ON users.position_id = positions.position_id ORDER BY users.employee_id ASC`,
        [departmentId]
      );
      let position = jointreedata.rows;
      // let puSers = poSer.rows;
      console.log("testjipo", position.results);

      return resolve(position, position.length);
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
      console.log("req", req.user_id);
      const department_name = req.body.department_name;
      const company_id = req.params.company_id;
      const createby = req.user_id;
      const updateby = req.user_id;
      const createdate = dateNow;
      const updatedate = dateNow;
      let companyId = req.params.company_id;

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
      console.log(results);
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



// get positionbydepartmentid
// function ;















const department = {
  departmentList: departmentList,
  departmentByCompanyId: departmentByCompanyId,
  departmentBydepartmentId:departmentBydepartmentId,
  departmentInfo: departmentInfo,
  createDepartment: createDepartment,
  updateDepartment: updateDepartment,
  deleteDepartment: deleteDepartment,
  ckcompanyId: companyList,
  dName: departmentName,
  companyInfo: companyInfo,
  fName:departmentfName,
};
module.exports = department;
