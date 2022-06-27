const authJwt = require("../../models/user/authentication");
const projectteam = require("../../models/project/projectteam");

//  1get projectteambycompanyid;
exports.getProjectbyCompany = async (req, res) => {
  let getProject = "";
  getProject = await projectteam.ProjectTeambyCompany(req, res);

  if (getProject.length == 0) {
    res
      .status(200)
      .send({ code: "WEPT404", description: "No Employee in Company." });
  } else {
    res.status(200).send({
      companyId: getProject.rows,
      total: getProject.length,
      projectTeam: getProject,
    });
  }
};

//get projectteam;
exports.listProjectteam = async (req, res) => {
  let getProject = "";
  getProject = await projectteam.listProjectTeam(req, res);

  if (getProject.length == 0) {
    res
      .status(200)
      .send({ code: "WEPT404", description: "Project ID Not found." });
  } else {
    res.status(200).send({
      total: getProject.length,
      projectTeam: getProject,
    });
  }
};

// create projectteam
exports.createProjectTeam = async (req, res) => {
  let createProject = null;
  createProject = await projectteam.createProjectTeam(req, res);
  res.status(200).send({ code: "WEPT200", description: "Success" });
  
};

// update projectteam;
exports.updateProjectteam = async (req, res) => {
  try {
    let updateProjectteam = null;

    updateProjectteam = await projectteam.updateProjectteam(req, res);
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEPT401", description: "Access Token Expired" });
    } else {
      res.status(200).send({
        code: "WEPT200",
        description: "Success",
      });
    }
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

// delete projectteam;
exports.deleteProjectteam = async (req, res) => {
  try {
    if (!req.params.project_on_hand_id) {
      res
        .status(200)
        .send({
          code: "WEPS400",
          description: "Project onhand Id cannot be Null.",
        });
    }
    let projectteamCk = await projectteam.deleteProjectteam(req, res);
    if (projectteamCk != "complete") {
      res
        .status(404)
        .send({ code: "WEPS404", description: "User id Not found." });
    } else {
      res.status(200).send({ code: "WEPT200", description: "Complete!" });
    }
    // console.log("ss testss", departmentData.length);
  } catch (error) {
    console.error("## ControlError ", error);
    return error;
  }
};

exports.testpostProjectTeam = async (req, res, next) => {
  let getProject = await projectteam.testpostProjectTeam(req, res);
  console.log("sss", getProject);
  if (getProject.rowCount > 0) {
    res.status(200).send({
      description: "User Not Found",
      rowCount: getProject.rowCount,
      testpostProjectTeam: getProject
    });
  } else {
    next();
  }
};

// testgetProjectTeam

exports.testgetProjectTeam = async (req, res, next) => {
  let getProject = await projectteam.testgetProjectTeam(req, res);
  console.log("ss", getProject.length, getProject.rows);
  if (getProject.length == 0) {
    next();
  } else {
    res.status(404).send({
      description: "User Already in Project",
      testgetProjectTeam: getProject,
    });
  }
};

exports.ckdelProjectTeam = async (req, res, next) => {
  let getProject = await projectteam.ckdeleteProjectTeam(req, res);
  console.log("ss", getProject);
  if (getProject.length !== 0) {
    next();
  } else {
    res
      .status(404)
      .send({
        code: "WEPT404",
        description: "User id Not Found",
        total: getProject.length,
        testgetProjectTeam: getProject,
      });
  }
};
