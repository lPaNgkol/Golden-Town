const authJwt = require("../../models/user/authentication");
const projectteam = require("../../models/project/projectteam");

//  1get projectteambycompanyid;
exports.getProjectbyCompany = async (req, res) => {
  let getProject = "";
  getProject = await projectteam.ProjectTeambyCompany(req, res);
  // console.log("vt", getProject);
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEPT401", description: "Access Token Expired" });
  }
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
exports.listProjectTeamAll = async (req, res) => {
  let getProject = "";
  getProject = await projectteam.listProjectTeamAll(req, res);
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEPT401", description: "Access Token Expired" });
  }
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

//get projectteam;
exports.listProjectteam = async (req, res) => {
  let getProject = "";
  getProject = await projectteam.listProjectTeam(req, res);
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEPT401", description: "Access Token Expired" });
  }
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
exports.createProjectTeam = async (req, res, next) => {
  let createProject = "";
  checkProject = await projectteam.checkuserByuserId(req, res);
  // console.log("checkproject",checkProject);
  if (!checkProject == 0) {
    res
      .status(200)
      .send({ code: "WEPT404", description: "User Already in Project." });

  }
  if (checkProject == 0) {
    res
      .status(200)
      .send({ code: "WEPT404", description: "User_ID not found." });
next();
  }
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEPT401", description: "Access Token Expired" });
  }
  else {
    createProject = await projectteam.createProjectTeam(req, res);
    res.status(200).send({
      projectTeam: createProject,
    });
  }
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
    }
    if (updateProjectteam.length == 0) {
      res
        .status(200)
        .send({ code: "WEPT404", description: "Project ID Not found." });
    } else {
      res.status(200).send({
        projectTeam: updateProjectteam,
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
    let projectteamCk = "";
    let projectteamUser = ""; 
    projectteamCk = await projectteam.checkbeforedeleteandupdate(req, res);
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEPT401", description: "Access Token Expired" });
    }
    if (projectteamCk.length == 0) {
      res
        .status(200)
        .send({ code: "WEPT403", description: "Project_onhand_id not Found." });
    }
    projectteamUser  = await projectteam.checkuserByuserId(req, res);
    if (projectteamUser.length == 0) {
      res
        .status(200)
        .send({ code: "WEPT404", description: "User_id not Found." });
    }
    else {
      projectteamData = await projectteam.deleteProjectteam(req, res);
      res
        .status(200)
        .send({ code: "WEPT200", description: "Project not Found." });
    }
    // console.log("ss testss", departmentData.length);
  } catch (error) {
    console.error("## ControlError ", error);
    return error;
  }
};
