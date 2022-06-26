const db = require("../dbconnection");
var format = require("pg-format");
var moment = require("moment");

// get all
function departmentList(req, res) {
  return new Promise(async (resolve) => {
    try {
      const data = await db.query(
        `SELECT a.*, b.employee_id, b.firstname, b.lastname, b.nickname, b.image_url, b.user_id, b.position_id, c.position_name, a.updatedate
         FROM department a
         LEFT JOIN users b on a.department_id=b.department_id
         LEFT JOIN positions c on c.position_id=b.position_id 
         WHERE a.company_id=$1
         ORDER BY a.department_id ASC`,
         [req.body.company_id]
      );
      var dataReturn = []
      var dataDepartment = {}
      var dataUser = {}
      var dataDepartmentUser = []
      let results = data.rows;
      var userCount = 0
      var oldDept = 0
      var oldDeptName = ''
      var oldCompany = 0
      if(results.length<=0){

      }else{
        results.forEach(row =>{
          if(oldDept==0){
            oldDept = row.department_id
            oldDeptName = row.department_name
            oldCompany = row.company_id
          }
          if(oldDept!=0 && oldDept!=row.department_id){
            dataDepartment["department_id"] = oldDept
            dataDepartment["department_name"] = oldDeptName
            dataDepartment["company_id"] = oldCompany
            dataDepartment["total_department_user"] = userCount
            dataDepartment["department_user"] = dataDepartmentUser
            dataReturn.push(dataDepartment)
            userCount = 0
            dataDepartment = {}
            dataDepartmentUser = []
            oldDept = row.department_id
            oldDeptName = row.department_name
            oldCompany = row.company_id
          }
          console.log(dataDepartment);
          dataUser = {}
          dataUser["employee_id"] = row["employee_id"]
          dataUser["firstname"] = row["firstname"]
          dataUser["lastname"] = row["lastname"]
          dataUser["nickname"] = row["nickname"]
          dataUser["image_url"] = row["image_url"]
          dataUser["user_id"] = row["user_id"]
          dataUser["position_id"] = row["position_id"]
          dataUser["position_name"] = row["position_name"]
          dataDepartmentUser.push(dataUser)
          userCount++
        })
        //last loop add last company to array
        dataDepartment["department_id"] = oldDept
        dataDepartment["department_name"] = oldDeptName
        dataDepartment["company_id"] = oldCompany
        dataDepartment["total_department_user"] = userCount
        dataDepartment["department_user"] = dataDepartmentUser
        dataReturn.push(dataDepartment)
      }

      return resolve(dataReturn);
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
        `SELECT department.department_name, users.employee_id,users.user_id, users.firstname, users.lastname, users.nickname,users.image_url, positions.position_id, positions.position_name
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
        `SELECT users.employee_id,users.user_id, users.firstname, users.lastname, users.nickname, positions.position_id, users.image_url, positions.position_name
FROM
department 
LEFT JOIN users ON department.department_id = users.department_id 
LEFT JOIN positions ON users.position_id = positions.position_id WHERE department.department_id = $1  ORDER BY users.user_id ASC;`,
        [departmentId]
      );
      let position = jointreedata.rows;
      // let puSers = poSer.rows;
      console.log("testjipos", jointreedata.rowCount);
      // console.log("jointreedata.rows.department_name", jointreedata.rows[0].user_id);

      console.log("testjipo", position);
      if (position == []) {
        return resolve(0);
      }
      if (jointreedata.rowCount == 0) {
        return resolve([]);
      } else {
        return resolve(position, position.rowCount);
      }
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
