const db = require("../dbconnection");
const moment = require("moment");
var format = require("pg-format");

// get project by companyId
function ProjectTeambyCompany(req, res) {
  return new Promise(async (resolve) => {
    try {
      let projectTeamId = req.params.company_id;
      const getProjectteam = await db.query(
        `SELECT users.user_id,users.firstname ,users.lastname, users.username,users.image_url,project_team.team_position,project_team.active      
        FROM
        project_team LEFT JOIN users ON users.user_id = project_team.user_id
        WHERE company_id = $1`,
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

function listProjectTeamAll(req, res) {
  return new Promise(async (resolve) => {
    try {
      const getProjectteam = await db.query(
        `SELECT users.user_id,users.firstname ,users.lastname, users.username,users.image_url,project_team.team_position,project_team.active
		    FROM
		    project_team LEFT JOIN users ON users.user_id = project_team.user_id`
      );
      let projectName = getProjectteam.rows;
      // for (row of projectName) {
      //   row.isActive === "T" ? row.isActive = "True" : row.isActive = "False";
      // }
      // console.log("test get", getProjectteam);
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
    WHERE project_team.project_on_hand_id = $1`,
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

// // post project by projectId
// function createProjectTeam(req, res) {
//   return new Promise(async (resolve) => {
//     try {
//       const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
//       const user_id = req.body.user_id;
//       const project_on_hand_id = req.params.project_on_hand_id;
//       const active = req.body.active;
//       const createby = req.user_id;
//       const updateby = req.user_id;
//       const createdate = dateNow;
//       const updatedate = dateNow;
//       const team_position = req.body.team_position;
//       const owner = req.body.owner;
//       const query = await db.query(`INSERT INTO project_team(project_on_hand_id, user_id, active, createby,
//         createdate, updateby, updatedate, team_position, owner)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
//       RETURNING project_team_id`,
//       [
//         user_id,
//         project_on_hand_id,
//         active,
//         createby,
//         createdate,
//         updateby,
//         updatedate,
//         team_position,
//         owner,
//       ]

//       );
//       let results = query.rows;
//       console.log("test again", results);
//       return resolve(results);
//     } catch (error) {
//       console.log("### error", error);
//       return res
//         .status(500)
//         .send({ code: "WEPT500", description: error.message });
//     }
//   });
// }

// post project by projectId
function createProjectTeam(req, res) {
  return new Promise(async (resolve) => {
    const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
    const user_id = req.body.user_id;
    const project_on_hand_id = req.params.project_on_hand_id;
    const active = req.body.active;
    const createby = req.user_id;
    const updateby = req.user_id;
    const createdate = dateNow;
    const updatedate = dateNow;
    const team_position = req.body.team_position;
    const owner = req.body.owner;
    let insertValue = [];
    for (var i = 0; i < req.body.user_id; i++) {
      insertValue.push([
        user_id[i],
        project_on_hand_id,
        "T",
        createby,
        createdate,
        updateby,
        updatedate,
        team_position,
        owner,
      ]);
    }
    let queryRole = format(
      "INSERT INTO user_role(user_id, project_on_hand_id,active, createby, createdate, updateby, updatedate,team_position, owner ) VALUES %L",
      insertValue
    );
    
    const data =await db.query(queryRole)
      .then(() => {
       
        resolve(data);
        console.log("test", data)
      })
      .catch((error) => {
        res.status(500).send({
          code: "WEPT500",
          description: error.message,
        });
      });
  });
}

// put project by projectId
function updateProjectteam(req, res) {
  return new Promise(async function (resolve) {
    try {
      const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
      const user_id = req.params.user_id;
      const project_on_hand_id = req.params.project_on_hand_id;
      const active = req.body.active;
      const createby = req.user_id;
      const updateby = req.user_id;
      const createdate = dateNow;
      const updatedate = dateNow;
      const team_position = req.body.team_position;
      const owner = req.body.owner;
      const data = await db.query(
        `UPDATE project_team
	SET active = $3, updateby=$4, updatedate=$5, team_position=$6, owner=$7
	WHERE project_on_hand_id=$1 AND user_id = $2 RETURNING project_team_id;`,
        [
          project_on_hand_id,
          user_id,
          active,
          updateby,
          updatedate,
          team_position,
          owner,
        ]
      );
      let dataresults = data.rows;
      console.log("data", data);
      let results = data.rowCount != 0 ? data.rows[0] : false;
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

// delete project by projectId
function deleteProjectteam(req, res) {
  return new Promise(async (resolve) => {
    try {
      const result = await db.query(
        "DELETE FROM project_team WHERE project_on_hand_id=$1 AND user_id = $2",
        [req.params.project_on_hand_id, req.params.user_id]
      );
      let results = result.rows;
      console.log("testresults", results, results.length);
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

//check
function projectteamByprojectId(req, res) {
  return new Promise(async (resolve) => {
    try {
      let project_on_hand_id = req.params.project_on_hand_id;
      const data = await db.query(
        `SELECT project_on_hand_id FROM project_team WHERE project_on_hand_id = $1`,
        [project_on_hand_id]
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
// check by users.user_id
function checkuserByuserId(req, res, next) {
  return new Promise(async (resolve) => {
    try {
      let user_id = req.body.user_id;
      const data = db.query(`SELECT * FROM users WHERE user_id = $1`, [
        user_id,
      ]);
      console.log(data.rowCount);
      let usercheck = data.rowCount;
      if (usercheck == 0) {
        console.log("data not found");
        return resolve((usercheck = 0));
        
      } else {
        next();
      }
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

// check project_on_hand_id
function checkidByonhandId(req, res, next) {
  return new Promise(async (resolve) => {
    try {
      let userid = req.params.project_on_hand_id;
      const data = await db.query(
        `SELECT * FROM project_on_hand WHERE project_on_hand_id = $1`,
        [userid]
      );
      let results = data.rows;
      console.log("project_on_hand_id", results, results.length);
      if (results.length == 0) {
        var ret = { code: "WEPT404", description: "Project not exist" };
        res.status(200).json(ret);
      } else {
        return resolve(results, results.length);
      }
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

// get after create success
function projectIdcreatesuccess(req, res) {
  return new Promise(async (resolve) => {
    try {
      const getProjectteam = await db.query(
        `SELECT project_team.project_team_id,project_on_hand.project_code,project_on_hand.project_name, project_on_hand.project_status, users.user_id,users.firstname ,users.lastname, users.username,users.image_url,project_team.team_position,project_team.active
        FROM
        project_team LEFT JOIN users ON users.user_id = project_team.user_id
        INNER JOIN project_on_hand ON project_team.project_on_hand_id = project_on_hand.project_on_hand_id 
      WHERE project_team.project_team_id = (SELECT max(project_team.project_team_id) FROM project_team)`
      );
      let results = getProjectteam.rows;
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

checkDuplicateuserId = (req, res, next) => {
  const query = "SELECT * FROM users WHERE user_id=$1 ORDER BY user_id DESC";
  const dataquery = [req.body.user_id];
  db.query(query, dataquery)
    .then((results) => {
      console.log("dupemployee");
      console.log(results.rows);
      if (results.rows.length > 0) {
        var ret = { code: "WEPT002", description: "User_Id already in use" };
        res.status(200).json(ret);
      } else {
        next();
      }
    })
    .catch((error) => {
      res.status(500).send({
        code: "WEEM500",
        description: error.message,
      });
    });
};

function checkbeforedeleteandupdate(req, res, next) {
  return new Promise(async (resolve) => {
    try {
      let project_on_hand_id = req.params.project_on_hand_id;
      let user_id = req.params.user_id;
      const data = await db.query(
        `SELECT * FROM project_team WHERE project_on_hand_id = $1 AND user_id = $2`,
        [project_on_hand_id, user_id]
      );
      let results = data.rows;
      console.log("project_on_hand_id", results, results.length);
      if (results.length == 0) {
        var ret = { code: "WEPT404", description: "Project not exist" };
        res.status(200).json(ret);
      } else {
        return resolve(results, results.length);
      }
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

const projectteam = {
  listProjectTeam: listProjectTeam,
  createProjectTeam: createProjectTeam,
  updateProjectteam: updateProjectteam,
  checkidByonhandId: checkidByonhandId,
  ProjectTeambyCompany: ProjectTeambyCompany,
  deleteProjectteam: deleteProjectteam,
  projectteamByprojectId: projectteamByprojectId,
  projectIdcreatesuccess: projectIdcreatesuccess,
  checkuserByuserId: checkuserByuserId,
  listProjectTeamAll: listProjectTeamAll,
  checkDuplicateuserId: checkDuplicateuserId,
  checkbeforedeleteandupdate: checkbeforedeleteandupdate,
};
module.exports = projectteam;
