const db = require("../dbconnection");

var moment = require("moment");

function healthinfoList(req, res) {
  return new Promise(function (resolve) {
    let query = `SELECT a.healthinfo_id, a.note, a.user_id, a.createby, a.createdate,a.updateby, a.updatedate,
                          b.firstname, b.lastname, b.nickname, b.employee_id
                          FROM health_info a JOIN users b ON a.user_id = b.user_id WHERE a.active = $1`;

    let dataquery = ["T"];
    if (req.body.limit) {
      query = query + " LIMIT $2";
      dataquery.push(req.body.limit);
    }
    if (req.body.offset) {
      query = query + " OFFSET $3";
      dataquery.push(req.body.offset);
    }
    // console.log(dataquery);

    db.query(query, dataquery)
      .then((results) => {
        console.log(query);
        resolve(results.rows);
      })
      .catch((error) => {
        res.status(500).send({
          message: error.message,
        });
      });
  });
}

function healthinfoByuserId(req, res) {
  return new Promise(function (resolve) {
    let query = `SELECT a.healthinfo_id, a.note, a.user_id, a.createby, a.createdate,a.updateby, a.updatedate,
                          b.firstname, b.lastname, b.nickname, b.employee_id
                          FROM health_info a JOIN users b ON a.user_id = b.user_id WHERE a.user_id = $1 AND a.active = 'T';`;

    let dataquery = [req.params.user_id];
    if (req.body.limit) {
      query = query + " LIMIT $2";
      dataquery.push(req.body.limit);
    }
    if (req.body.offset) {
      query = query + " OFFSET $3";
      dataquery.push(req.body.offset);
    }
    // console.log(dataquery);

    db.query(query, dataquery)
      .then((results) => {
        console.log(query);
        resolve(results.rows);
      })
      .catch((error) => {
        res.status(500).send({
          message: error.message,
        });
      });
  });
}

function createHealthinfo(req, res) {
  var time = moment();
  var dateNow = time.format("YYYY-MM-DD HH:mm:ss");
  const user_id = req.params.user_id;
  const imageurl = req.body.imageurl;
  const createby = req.body.createby;
  const active = "T";
  const note = req.body.note;
  const createdate = dateNow;
  return new Promise(async (resolve) => {
    try {
      const query = await db.query(
        `INSERT INTO health_info(user_id, imageurl, createby, active, note, createdate) 
                     VALUES ($1, $2, $3, $4, $5, $6)  RETURNING healthinfo_id;`,
        [user_id, imageurl, createby, active, note, createdate]
      );
      let results = query.rows;
      console.log("results", results);
      return resolve(results, results.length);
    } catch (error) {
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEHF500",
        description: error.message,
      });
    }
  });
}

function updateHealthinfo(req, res) {
  const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
  const user_id = req.params.user_id;
  const healthinfo_id = req.params.healthinfo_id;
  const imageurl = req.body.imageurl;
  const updateby = req.user_id;
  const active = "T";
  const note = req.body.note;
  const updatedate = dateNow;
  return new Promise(async (resolve) => {
    try {
      const query = await db.query(
        `UPDATE health_info SET user_id=$2, imageurl=$3, note=$4, active=$5, updateby=$6, updatedate=$7
    WHERE healthinfo_id = $1 RETURNING healthinfo_id`,
        [healthinfo_id, user_id, imageurl, note, active, updateby, updatedate]
      );
      let results = query.rows;
      console.log("results", results);
      return resolve(results, results.length);
    } catch (error) {
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEHF500",
        description: error.message,
      });
    }
  });
}

function deleteHealthinfo(req, res) {
  return new Promise(async (resolve) => {
    try {
      // const selectquery = await db.query
      const result = await db.query(
        "DELETE FROM health_info WHERE healthinfo_id=$1",
        [req.params.healthinfo_id]
      );
      let results = result.rows;
      return resolve(results, results.length);
    } catch (error) {
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEHF500",
        description: error.message,
      });
    }
  });
}


// user_id check
function useridCheck(req, res, next) {
  return new Promise(async (resolve) => {
    try {
      let userIdcheck = req.params.user_id;
      const poSer = await db.query(
        `SELECT user_id FROM users WHERE user_id=$1 `,
        [userIdcheck]
      );
      let poscheck = poSer.rowCount;
      if (poscheck !== 0) {
        console.log("have data", poSer.rows);
        return resolve((poscheck = 1));
      } else {
        console.log("data not found", poSer.length);
        return resolve((poscheck = 0));
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



const healthinfo = {
  healthinfoList: healthinfoList,
  healthinfoByuserId: healthinfoByuserId,
  createHealthinfo: createHealthinfo,
  updateHealthinfo: updateHealthinfo,
  deleteHealthinfo: deleteHealthinfo,
  useridCheck:useridCheck
};
module.exports = healthinfo;
