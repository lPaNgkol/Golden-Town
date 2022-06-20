const db = require("../dbconnection");
const moment = require("moment");

// vaccinelist
function vaccinelist(req, res) {
  return new Promise(async (resolve) => {
    try {
      const query =
        await db.query(`SELECT vaccine_info_id, user_id, dose_no, vaccine_name, vaccine_site, inject_date, active, createby, createdate, updateby, updatedate
            FROM vaccine_info`);
      let info = query.rows;
      console.log("vaccinelist", info);
      return resolve(info);
    } catch (err) {
      console.error("###error", error);
    }
    return res.status(500).send({ code: "WEVC500", description: err.message });
  });
}

// vaccinelistbycompanyId
function vaccinelistbycompanyId(req, res) {
  return new Promise(async (resolve) => {
    try {
      const query = await db.query(
        `SELECT a.*, a.user_id, a.dose_no
          FROM vaccine_info a LEFT JOIN users b ON a.user_id = b.user_id WHERE b.company_id = $1`,
        [req.params.company_id]
      );
      console.log(query.rows);
      let info = query.rows;
      return resolve(info);
    } catch (err) {
      console.error("###error", error);
    }
    return res.status(500).send({ code: "WEVC500", description: err.message });
  });
}

// vacinelistbyuserId
function vaccinelistbyuserId(req, res) {
  return new Promise(async (resolve) => {
    try {
      const query = await db.query(
        `SELECT vaccine_info_id, user_id, dose_no, vaccine_name, vaccine_site, inject_date, active, createby, createdate, updateby, updatedate
              FROM vaccine_info WHERE user_id = $1`,
        [req.params.user_id]
      );
      let info = query.rows;
      return resolve(info);
    } catch (err) {
      console.error("###error", error);
    }
    return res.status(500).send({ code: "WEVC500", description: err.message });
  });
}

// createvaccine
function createvaccine(req, res) {
  return new Promise(async (resolve) => {
    try {
      const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
      const user_id = req.params.user_id;
      const dose_no = req.body.dose_no;
      const vaccine_name = req.body.vaccine_name;
      const vaccine_site = req.body.vaccine_site;
      const inject_date = dateNow;
      const active = req.body.active;
      const createby = req.user_id;
      const createdate = dateNow;
      const updateby = req.user_id;
      const updatedate = dateNow;
      const query = await db.query(
        `INSERT INTO vaccine_info(
	 user_id, dose_no, vaccine_name, vaccine_site, inject_date, active, createby, createdate, updateby, updatedate)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING vaccine_info_id`,
        [
          user_id,
          dose_no,
          vaccine_name,
          vaccine_site,
          inject_date,
          active,
          createby,
          createdate,
          updateby,
          updatedate,
        ]
      );
      let info = query.rows;
      return resolve(info);
    } catch (error) {
      console.error("###error", error);
      return res
        .status(500)
        .send({ code: "WEVC500", description: error.message });
    }
  });
}

// updatevaccine
function updatevaccine(req, res) {
  return new Promise(async function (resolve) {
    try {
      const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
      const vaccine_info_id = req.params.vaccine_info_id;
      const user_id = req.params.user_id;
      const dose_no = req.body.dose_no;
      const vaccine_name = req.body.vaccine_name;
      const vaccine_site = req.body.vaccine_site;
      const inject_date = dateNow;
      const active = req.body.active;
      const createby = req.user_id;
      const createdate = dateNow;
      const updateby = req.user_id;
      const updatedate = dateNow;
      const query = await db.query(
        `UPDATE vaccine_info
      SET  dose_no=$3, vaccine_name=$4, vaccine_site=$5, active=$6, createby=$7, createdate=$8, updateby=$9, updatedate=$10
      WHERE user_id = $1 AND vaccine_info_id = $2 RETURNING vaccine_info_id`,
        [
          user_id,
          vaccine_info_id,
          dose_no,
          vaccine_name,
          vaccine_site,
          active,
          createby,
          createdate,
          updateby,
          updatedate,
        ]
      );
      let data = query.rows;
      let results = query.rowCount != 0 ? query.rows[0] : false;
      console.log("1",results);
      console.log("2", data);
      return resolve(results);
    } catch (error) {
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEPT500",
        description: error.message,
      });
    }
  });
}

// deletevaccine
function deletevaccine(req, res) {
  return new Promise(async function (resolve) {
    try {
      const deletequery = await db.query(
        `DELETE FROM vaccine_info WHERE user_id = $1 AND vaccine_info_id = $2`,
        [req.params.user_id, req.params.vaccine_info_id]
      );
      let results = deletequery.rows;
      return resolve(results);
    } catch (error) {
      console.error("### Error ", error);
      // return resolve(false);
      return res.status(500).send({
        code: "WEPT500",
        description: error.message,
      });
    }
  });
}

// check userid
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

const vaccine = {
  vaccinelist: vaccinelist,
  vaccinelistbycompanyId: vaccinelistbycompanyId,
  vaccinelistbyuserId: vaccinelistbyuserId,
  createvaccine: createvaccine,
  updatevaccine: updatevaccine,
  deletevaccine: deletevaccine,
  useridCheck: useridCheck,
};
module.exports = vaccine;