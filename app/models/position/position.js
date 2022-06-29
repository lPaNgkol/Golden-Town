const db = require("../dbconnection");
var format = require("pg-format");
var moment = require("moment");

function positionList(req, res) {
  return new Promise(function (resolve) {
    let query = `SELECT a.position_id, a.position_name, a.department_id, b.department_name,
    a.createby, a.updateby, a.updatedate, a.createdate
    FROM positions a LEFT JOIN department b ON a.department_id = b.department_id WHERE a.active = 'T'`;
    if (req.body.limit) {
      query = query + " LIMIT $2";
      // dataquery.push(req.body.limit);
    }
    if (req.body.offset) {
      query = query + " OFFSET $3";
      // dataquery.push(req.body.offset);
    }
    // console.log(dataquery);

    db.query(query)
      .then((results) => {
        console.log(query);
        resolve(results.rows);
      })
      .catch((error) => {
        res.status(500).send({
          code: "WEPS500",
          message: error.message,
        });
      });
  });
}

// get positionby company_id
function positioncompanyList(req, res) {
  return new Promise(async (resolve) => {
    try {
      const active = "T";
      const company_id = req.params.company_id;
      console.log("com", company_id);
      const query = await db.query(
        `SELECT a.position_id, a.position_name, a.department_id, b.department_name,
                  a.createby, a.updateby, a.updatedate, a.createdate
                  FROM positions a LEFT JOIN department b ON a.department_id = b.department_id WHERE a.active = 'T' and a.company_id = $1`,
        [company_id]
      );

      let dataquery = query.rows;
      let datalenth = query.rowCount;
      console.log(dataquery);
      return resolve(dataquery, datalenth);
    } catch (error) {
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEPS500",
        description: error.message,
      });
    }
  });
}

function createPosition(req, res) {
  return new Promise(async function (resolve) {
    try {
      const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
      const company_id = req.params.company_id;
      const position_name = req.body.position_name;
      const department_id = req.body.department_id;
      const active = "T";
      const createby = req.user_id;
      const updateby = req.user_id;
      const createdate = dateNow;
      const updatedate = dateNow;
      const query = await db.query(
        `INSERT INTO positions(position_name, department_id, active, createby, createdate,updateby, updatedate, company_id) 
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING position_id`,
        [
          position_name,
          department_id,
          active,
          createby,
          createdate,
          updateby,
          updatedate,
          company_id,
        ]
      );
      let postPosition = query.rows;
      console.log("postposition", postPosition);
      return resolve(postPosition, postPosition.length);
    } catch (error) {
      console.error("### Error ", error);
      return res.status(500).send({
        code: "WEPS500",
        description: error.message,
      });
    }
  });
}

// update position
function updatePosition(req, res) {
  return new Promise(async function (resolve) {
    try {
      const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
      const position_id = req.params.position_id;
      const position_name = req.body.position_name;
      const active = "T";
      const createby = req.user_id;
      const updateby = req.user_id;
      const createdate = dateNow;
      const updatedate = dateNow;
      const department_id = req.body.department_id;
      const data = await db.query(
        `UPDATE positions
SET  position_name=$2, department_id=$3, active=$4, createby=$5, createdate=$6, updateby=$7, updatedate=$8
WHERE position_id=$1`,
        [
          position_id,
          position_name,
          department_id,
          active,
          createby,
          createdate,
          updateby,
          updatedate,
        ]
      );
      let results = data.rowCount != 0 ? data.rows[0] : false;
      return resolve(results);
    } catch (error) {
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEPS500",
        description: error.message,
      });
    }
  });
}

// delete position
function deletePosition(req, res) {
  return new Promise(async (resolve) => {
    try {
      const result = await db.query(
        "DELETE FROM positions WHERE position_id=$1",
        [req.params.position_id]
      );
      console.log(result.rows);
      return resolve("complete");
    } catch (error) {
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEPS500",
        description: error.message,
      });
    }
  });
}

// check position
function positionCheck(req, res, next) {
  return new Promise(async (resolve) => {
    try {
      let positioncheck = req.params.position_id;
      const poSer = await db.query(
        `SELECT position_id from positions WHERE position_id = $1`,
        [positioncheck]
      );
      let poscheck = poSer.rowCount;
      if (poscheck > 0) {
        next();
      } else {
        console.log("No data");
        var ret = { code: "WEPT404", description: "Position id not found" };
        res.status(404).json(ret);
      }
    } catch (error) {
      console.error("### Error ", error);
      return res.status(500).send({
        code: "WEPS500",
        description: error.message,
      });
    }
  });
}

// check positionbycompany
function positioncompanyCheck(req, res, next) {
  return new Promise(async (resolve) => {
    try {
      let companycheck = req.params.company_id;
      const poSer = await db.query(
        `SELECT company_id FROM company WHERE company_id=$1`,
        [companycheck]
      );
      let poscheck = poSer.rowCount;
      if (poscheck !== 0) {
        console.log("have data");
        return resolve((poscheck = 1));
      } else {
        console.log("data not found");
        return resolve((poscheck = 0));
      }
    } catch (error) {
      console.error("### Error ", error);
      return res.status(500).send({
        code: "WEPS500",
        description: error.message,
      });
    }
  });
}

// check position_name
function positionnameCheck(req, res, next) {
  return new Promise(async (resolve) => {
    try {
      let positioncheck = req.body.position_name;
      const poSer = await db.query(
        `SELECT position_id from positions WHERE position_name = $1`,
        [positioncheck]
      );
      let poscheck = poSer.rowCount;
      if (poscheck > 0) {
        console.log("have data");
        var ret = {
          code: "WEPS404",
          description: "Position Name Already in Project",
        };
        res.status(200).json(ret);
        return resolve((poscheck = 1));
      } else {
        console.log("data not found");
        next(resolve((poscheck = 0)));
      }
    } catch (error) {
      console.error("### Error ", error);
      return res.status(500).send({
        code: "WEPS500",
        description: error.message,
      });
    }
  });
}

// check departmentid
function departmentidCheck(req, res, next) {
  return new Promise(async (resolve) => {
    try {
      let departmentcheck = req.body.department_id;
      const poSer = await db.query(
        `SELECT department_id FROM department WHERE department_id=$1`,
        [departmentcheck]
      );
      var datacheck = poSer.rowCount;
      if (datacheck !== 0) {
        console.log("have data");
        next(resolve((datacheck = 1)));
      } else {
        console.log("data not found");
        var ret = { code: "WEPS404", description: "Department_id not found" };
        res.status(404).json(ret);
        return resolve((datacheck = 0));
      }
    } catch (error) {
      console.error("### Error ", error);
      return res.status(500).send({
        code: "WEDP500",
        description: error.message,
      });
    }
  });
}

const position = {
  positionList: positionList,
  positioncompanyList: positioncompanyList,
  createPosition: createPosition,
  updatePosition: updatePosition,
  deletePosition: deletePosition,
  positionCheck: positionCheck,
  positionnameCheck: positionnameCheck,
  positioncompanyCheck: positioncompanyCheck,
  departmentidCheck: departmentidCheck,
};
module.exports = position;
