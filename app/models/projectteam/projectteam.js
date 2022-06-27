const db = require("../dbconnection");
const moment = require("moment");
var format = require("pg-format");
const { request } = require("express");

// get project by companyId
function ProjectTeambyCompany(req, res) {
  return new Promise(async (resolve) => {
    try {
      let projectTeamId = req.params.company_id;
      const active = request.active;
      const getProjectteam = await db.query(
        `SELECT users.user_id,users.firstname ,users.lastname, users.username,users.image_url,project_team.team_position,project_team.active      
        FROM
        project_team LEFT JOIN users ON users.user_id = project_team.user_id
        WHERE company_id = $1 AND project_team.active = 'T' ORDER BY users.user_id ASC`,
        [req.params.company_id]
      );

      let projectName = getProjectteam.rows;

      // console.log("test get", paramsIs);
      return resolve(projectName);
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

// get project by projectId
function listProjectTeam(req, res) {
  let project_team_id = req.params.project_on_hand_id;
  return new Promise(async (resolve) => {
    try {
      const getProjectteam = await db.query(
        `SELECT users.user_id,users.firstname ,users.lastname, users.username,users.image_url,project_team.team_position,project_team.active
		FROM
		project_team LEFT JOIN users ON users.user_id = project_team.user_id
    WHERE project_team.project_on_hand_id = $1 AND project_team.active = 'T' ORDER BY users.user_id ASC`,
        [project_team_id]
      );
      let projectName = getProjectteam.rows;
      // for (row of projectName) {
      //   row.isActive === "T" ? row.isActive = "True" : row.isActive = "False";
      // }
      console.log("test get", projectName);
      return resolve(projectName);
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

// post project by projectId
function createProjectTeam(req, res) {
  return new Promise(async (resolve) => {
    try {
      const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
      //const user_id = req.body.user_id;
      // const project_on_hand_id = req.params.project_on_hand_id;
      //const active = req.body.active;
      const createby = req.user_id;
      const updateby = req.user_id;
      const createdate = dateNow;
      const updatedate = dateNow;
      //const team_position = req.body.team_position;
      //const owner = req.body.owner;

      let requestArrayBody = req.body;
      let requestInsertData = [];

      for (let body of requestArrayBody) {
        requestInsertData.push({
          user_id: body.user_id,
          project_on_hand_id: body.project_on_hand_id,
          active: body.active,
          team_position: body.team_position,
          owner: body.owner,
          createby: createby,
          updateby: updateby,
          createdate: createdate,
          updatedate: updatedate,
        });
      }

      let sqlQuery = `INSERT INTO project_team (user_id, project_on_hand_id, active, team_position, owner, createby, updateby, createdate, updatedate) VALUES ${requestInsertData
        .map(
          (request) =>
            `(${request.user_id}, ${request.project_on_hand_id}, '${request.active}', ${request.team_position}, '${request.owner}', ${request.createby}, ${request.updateby}, '${request.createdate}', '${request.updatedate}')`
        )
        .join(",")};`;
      let query = await db.query(sqlQuery);

      let results = query.rows;
      // console.log("test again", results);
      return resolve(results);
    } catch (error) {
      console.log("### error", error);
      return res
        .status(500)
        .send({ code: "WEPT500", description: error.message });
    }
  });
}

// put project by projectId
function updateProjectteam(req, res) {
  return new Promise(async function (resolve) {
    try {
      const dateNow = moment().format("YYYY-MM-DD HH-mm-ss");
      const project_on_hand_id = req.params.project_on_hand_id;
      // const active = req.body.active;
      // const project_team_id = req.body.project_team_id;
      const createby = req.user_id;
      const updateby = req.user_id;
      const createdate = dateNow;
      const updatedate = dateNow;
      // const team_position = req.body.team_position;
      // const owner = req.body.owner;

      let requestArrayBody = req.body;
      let requestInsertData = [];

      for (let body of requestArrayBody) {
        requestInsertData.push({
          project_team_id: body.project_team_id,
          user_id: body.user_id,
          project_on_hand_id: project_on_hand_id,
          active: body.active,
          team_position: body.team_position,
          owner: body.owner,
          updateby: updateby,
          updatedate: updatedate,
        });
      }
      let sqlValues = requestInsertData
        .map(
          (request) =>
            `(${request.project_team_id}, ${request.project_on_hand_id}, ${request.user_id}, '${request.active}', ${request.updateby},  NOW() , ${request.team_position}, '${request.owner}')`
        )
        .join(",");

      let sqlQuery = `UPDATE project_team as pt SET
      project_team_id = c.project_team_id,
      project_on_hand_id = c.project_on_hand_id,
      user_id = c.user_id,
      active = c.active,
      updateby = c.updateby,
      updatedate = c.updatedate,
      team_position = c.team_position,
      owner = c.owner
    FROM (VALUES
    ${sqlValues}
    ) as c(project_team_id, project_on_hand_id, user_id, active, updateby, updatedate, team_position, owner)
    WHERE c.project_team_id = pt.project_team_id `;
      console.log("sqlValues", sqlValues);
      console.log("sqlQuery", sqlQuery);
      let query = await db.query(sqlQuery);

      let dataresults = query.rows;
      //     console.log("data", data);
      let results = query.rowCount != 0 ? query.rows[0] : false;
      return resolve(dataresults, results);
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

function deleteProjectteam(req, res) {
return new Promise(async (resolve) => {
  try {
    const project_on_hand_id = req.params.project_on_hand_id;

    let requestDeleteBody = req.body;
    let requestInsertData = [];

    for (let body of requestDeleteBody) {
      requestInsertData.push({
        user_id: body.user_id,
        project_on_hand_id: project_on_hand_id,
        active: body.active,
      });
    }
    let sqlDValues = requestInsertData
      .map(
        (request) =>
          `(${request.project_on_hand_id}, ${request.user_id}, 'F')`
      )
      .join(",");

    let sqlDQuery = `UPDATE project_team as pt SET
    user_id = c.user_id,
    active = c.active
  FROM (VALUES ${sqlDValues}) as c(project_on_hand_id, user_id, active)
  WHERE c.project_on_hand_id = pt.project_on_hand_id`;
    console.log("sqlValues", sqlDValues);
    console.log("sqlQuery", sqlDQuery);
    let query = await db.query(sqlDQuery);

    let results = query.rows;
    console.log("testresults", results, results.length);
    return resolve("complete");
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

// demo
function ckdeleteProjectTeam(req, res, next) {
  try {
    return new Promise(async (resolve) => {
      let requestArrayBody = req.body;
      let userId = requestArrayBody.map((req) => req.user_id);
      console.log(userId);
      let query = await db.query(
        `SELECT user_id FROM project_team WHERE user_id = ANY($1::int[])`,
        [userId]
      );
      let results = query.rowCount;
      console.log("results", results);
      return resolve(results);
    });
  } catch (error) {
    console.error("### Error ", error);
    // return resolve(false);
    return res.status(500).send({
      code: "WEPT500",
      description: error.message,
    });
  }
}

// check by users.user_id
function checkuserByuserId(req, res) {
  return new Promise(async (resolve) => {
    try {
      // Username
      let dataquery = [];
      const user_id = req.body.user_id;
      let query = db.query(
        `SELECT * FROM users WHERE user_id = $1 ORDER BY user_id DESC`,
        [req.body.user_id]
      );
      db.query(query).then((results) => {
        console.log("user_id: ", results.rows.length);
        if (results.rows.length > 0) {
          return resolve(results == 0);
        } else {
          return resolve(results == 1);
        }
      });
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
function testpostProjectTeam(req, res, next) {
  return new Promise(async (resolve) => {
    try {
      let requestArrayBody = req.body;
      let requestInsertData = [];

      for (let body of requestArrayBody) {
        requestInsertData.push({
          user_id: body.user_id,
          project_on_hand_id: body.project_on_hand_id,
        });
      }
      let sqlValues = requestInsertData
        .map((request) => `(${request.user_id}, ${request.project_on_hand_id})`)
        .join(",");

      console.log("sqlValues", sqlValues);
      let query = await db.query(
        `SELECT user_id, project_on_hand_id FROM project_team WHERE ${sqlValues}`
      );
      console.log("query ", query.rows);
      console.log("query row", query);

      let results = [query.rows];
      console.log("post", results);
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

// testgetProjectTeam
function testgetProjectTeam(req, res, next) {
  return new Promise(async (resolve) => {
    try {
      let requestArrayBody = req.body;
      let userId = requestArrayBody.map((req) => req.user_id);
      console.log(userId);
      let query = await db.query(
        `SELECT user_id FROM users WHERE user_id = ANY($1::int[])`,
        [userId]
      );
      let results = query.rows;
      console.log("result get", results);
      if (userId == null) {
        return userId;
      }
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

function getDemo(req, res) {
  try {
    return new Promise(async (resolve) => {
      let requestArrayBody = req.body;
      let requestInsertData = [];
      for (let body of requestArrayBody) {
        requestInsertData.push({
          user_id: body.user_id,
          project_on_hand_id: body.project_on_hand_id,
        });
      }
      let sqlValues = requestInsertData
        .map((request) => `(${request.user_id}, ${request.project_on_hand_id})`)
        .join(",");
      let sqlQuery = `SELECT user_id project_on_hand_id
  FROM project_team WHERE ${sqlValues}`;

      console.log("sqlValues", sqlValues);
      console.log("sqlQuery", sqlQuery);
      let query = await db.query(sqlQuery, sqlValues);

      let results = query.rows;
      return resolve(dataresults, results);
    });
  } catch (error) {
    console.error("### Error ", error);
    // return resolve(false);
    return res.status(500).send({
      code: "WEPT500",
      description: error.message,
    });
  }
}

const projectteam = {
  listProjectTeam: listProjectTeam,
  createProjectTeam: createProjectTeam,
  updateProjectteam: updateProjectteam,
  ProjectTeambyCompany: ProjectTeambyCompany,
  deleteProjectteam: deleteProjectteam,
  checkuserByuserId: checkuserByuserId,
  testgetProjectTeam: testgetProjectTeam,
  ckdeleteProjectTeam: ckdeleteProjectTeam,
  testpostProjectTeam: testpostProjectTeam,
  getDemo: getDemo,
};
module.exports = projectteam;
