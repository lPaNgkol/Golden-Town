const db = require("../dbconnection");
const moment = require("moment");

// get project by companyId
function ProjectTeambyCompany(req, res) {
  let projectTeamId = req.params.company_id;

  return new Promise(async (resolve) => {
    try {
      const getProjectteam = await db.query(
        `SELECT (project_team.project_team_id) "projectTeamId",(project_on_hand.project_code) "projectCode", (project_on_hand.project_name) "projectName", (project_on_hand.project_status) "projectStatus", 
     (users.user_id) "userId", concat(users.firstname, ' ' ,users.lastname) "Name" , (users.username) "email", (users.image_url) "image" ,
       (project_team.team_position) "roleProject",
       CASE WHEN project_team.active = 'T' THEN 'True'
       ELSE 'False' END
       AS "isActive"
      FROM
      project_team LEFT JOIN users ON users.user_id = project_team.user_id
      INNER JOIN project_on_hand ON project_team.project_on_hand_id = project_on_hand.project_on_hand_id 
      WHERE project_on_hand.company_id = $1`,
        [req.params.company_id]
      );
      let paramsIs = projectTeamId;
      let projectName = getProjectteam.rows;


      console.log("test get", paramsIs);
      return resolve(projectName, paramsIs);
    } catch (error) {
      console.error("### Error ", error);
      return res.status(500).send({
        code: "WEPT500",
        description: error.message,
      });
    }
  });
}

function listProjectTeamAll(req, res) {
  let projectTeam = req.params.project_team_id;
  return new Promise(async (resolve) => {
    try {
      const getProjectteam = await db.query(
        `SELECT (project_team.project_team_id) "projectTeamId",(project_on_hand.project_code) "projectCode", (project_on_hand.project_name) "projectName", (project_on_hand.project_status) "projectStatus", 
     (users.user_id) "userId", concat(users.firstname, ' ' ,users.lastname) "Name" , (users.username) "email", (users.image_url) "image" ,
       (project_team.team_position) "roleProject",
       CASE WHEN project_team.active = 'T' THEN 'True'
       ELSE 'False' END
       AS "isActive"
      FROM
      project_team LEFT JOIN users ON users.user_id = project_team.user_id
      INNER JOIN project_on_hand ON project_team.project_on_hand_id = project_on_hand.project_on_hand_id 
` );
      let projectName = getProjectteam.rows;


  
      return resolve(projectName);
    } catch (error) {
      console.error("### Error ", error);

      return res.status(500).send({
        code: "WEPT500",
        description: error.message,
      });
    }
  });
}



// get project by projectId
function listProjectTeam(req, res) {
  let projectTeamId = req.params.project_team_id;

  return new Promise(async (resolve) => {
    try {
      const getProjectteam = await db.query(
        `SELECT (project_team.project_team_id) "projectTeamId",(project_on_hand.project_code) "projectCode", (project_on_hand.project_name) "projectName", (project_on_hand.project_status) "projectStatus", 
     (users.user_id) "userId", concat(users.firstname, ' ' ,users.lastname) "Name" , (users.username) "email", (users.image_url) "image" ,
       (project_team.team_position) "roleProject",
       CASE WHEN project_team.active = 'T' THEN 'True'
       ELSE 'False' END
       AS "isActive"
      FROM
      project_team LEFT JOIN users ON users.user_id = project_team.user_id
      INNER JOIN project_on_hand ON project_team.project_on_hand_id = project_on_hand.project_on_hand_id 
      WHERE project_team.project_team_id = $1`,
        [req.params.project_team_id]
      );

      let projectName = getProjectteam.rows;
      

      
      return resolve(projectName);
    } catch (error) {
      console.error("### Error ", error);
     
      return res.status(500).send({
        code: "WEPT500",
        description: error.message,
      });
    }
  });
}

// post project by projectId
function createProjectTeam(req, res) {
  return new Promise(async function (resolve) {
    try {
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
      const query = await db.query(
        `INSERT INTO project_team(user_id, project_on_hand_id, active, createby, 
          createdate, updateby, updatedate, team_position, owner) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING project_team_id`,
        [
          user_id,
          project_on_hand_id,
          active,
          createby,
          createdate,
          updateby,
          updatedate,
          team_position,
          owner,
        ]
      );
      let results = query.rows;
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
      const dateNow = moment().format("YYYY-MM-DD HH:mm:ss");
      const project_team_id = req.params.project_team_id;
      const user_id = req.body.user_id;
      const project_on_hand_id = req.body.project_on_hand_id;
      const active = req.body.active;
      const createby = req.user_id;
      const updateby = req.user_id;
      const createdate = dateNow;
      const updatedate = dateNow;
      const team_position = req.body.team_position;
      const owner = req.body.owner;
      const data = await db.query(
        `UPDATE project_team
	SET  user_id =$2, project_on_hand_id=$3,active = $4, updateby=$5, updatedate=$6, team_position=$7, owner=$8
	WHERE project_team_id = $1 RETURNING project_team_id;`,
        [
          project_team_id,
          user_id,
          project_on_hand_id,
          active,
          updateby,
          updatedate,
          team_position,
          owner,
        ]
      );

      let results = data.rowCount != 0 ? data.rows[0] : false;
      return resolve(results);
    } catch (error) {
      console.error("### Error ", error);
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
        "DELETE FROM project_team WHERE project_team_id=$1",
        [req.params.project_team_id]
      );
      let results = result.rows;
      return resolve(results, results.length);
    } catch (error) {
      console.error("### Error ", error);
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
      let project_team_id = req.params.project_team_id;
      const data = await db.query(
        `SELECT project_team_id FROM project_team WHERE project_team_id = $1`,
        [project_team_id]
      );
      let results = data.rows;
      return resolve(results, results.length);
    } catch (error) {
      console.error("### Error ", error);
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
      let userid = req.body.user_id;
      const data = await db.query(`SELECT * FROM users WHERE user_id = $1`, [
        userid,
      ]);
      let results = data.rows;
      console.log("r", results, results.length);
      if (results.length == 0) {
        var ret = { code: "WEPO404", description: "Project not exist" };
        res.status(200).json(ret);
      } else {
        return resolve(results, results.length);
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
      if (results.length == 0) {
        var ret = { code: "WEPO404", description: "Project not exist" };
        res.status(200).json(ret);
      } else {
        return resolve(results, results.length);
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

// get after create success
function projectIdcreatesuccess(req, res) {
  return new Promise(async (resolve) => {
    try {
      const getProjectteam = await db.query(
        `SELECT (project_team.project_team_id) "projectTeamId",(project_on_hand.project_code) "projectCode", (project_on_hand.project_name) "projectName", (project_on_hand.project_status) "projectStatus", 
     (users.user_id) "userId", concat(users.firstname, ' ' ,users.lastname) "Name" , (users.username) "email", (users.image_url) "image" ,
       (project_team.team_position) "roleProject",
       CASE WHEN project_team.active = 'T' THEN 'True'
       ELSE 'False' END
       AS "isActive"
      FROM
      project_team LEFT JOIN users ON users.user_id = project_team.user_id
      INNER JOIN project_on_hand ON project_team.project_on_hand_id = project_on_hand.project_on_hand_id 
      WHERE project_team.project_team_id = (SELECT max(project_team.project_team_id) FROM project_team)`
      );
      let results = getProjectteam.rows;
      return resolve(results);
    } catch (error) {
      console.error("### Error ", error);
      return res.status(500).send({
        code: "WEDP500",
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
  listProjectTeamAll:listProjectTeamAll
};
module.exports = projectteam;
