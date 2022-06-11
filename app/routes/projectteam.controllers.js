const authJwt = require("../../models/user/authentication");
const projectteam = require("../../models/project/projectteam");

//  1get projectteambycompanyid;
exports.getProjectbyCompany = async (req, res) => {
  let getProject = "";
  getProject = await projectteam.ProjectTeambyCompany(req, res);
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEPT401", description: "Access Token Expired" });
  }
  if (getProject.length == 0) {
    res
      .status(200)
      .send({ code: "WEPT404", description: "Company Not found." });
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
  if (checkProject.length == 0) {
    res.status(200).send({ code: "WEPT404", description: "User Not found." });
  }
  onhandId = await projectteam.checkidByonhandId(req, res);
  if (onhandId.length == 0) {
    res
      .status(200)
      .send({ code: "WEPT404", description: "Project_onhand Not found." });
  }
  createProject = await projectteam.createProjectTeam(req, res);
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEPT401", description: "Access Token Expired" });
  }
  if (createProject.length == 0) {
    res
      .status(200)
      .send({ code: "WEPT404", description: "Project ID Not found." });
  }
  if (createProject.length > 0) {
    getProjectteam = await projectteam.projectIdcreatesuccess(req, res);
    res.status(200).send({
      projectTeam: getProjectteam,
    });
  }
};

// update project team
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
      getProjectteam = await projectteam.listProjectTeam(req, res);
      res.status(200).send({
        projectTeam: getProjectteam,
      });
    }
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

delete projectteam;
exports.deleteProjectteam = async (req, res) => {
  try {
    let projectteamCk = "";
    projectteamCk = await projectteam.projectteamByprojectId(req, res);
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEPT401", description: "Access Token Expired" });
    }
    // console.log("ss test", departmentCk.length);
    if (projectteamCk.length == 0) {
      res
        .status(200)
        .send({ code: "WEPT404", description: "Project not Found." });
    }
    if (!projectteamCk.length == 0) {
      projectteamData = await projectteam.deleteProjectteam(req, res);
      res
        .status(200)
        .send({ code: "WEPT404", description: "Project not Found." });
    }
    // console.log("ss testss", departmentData.length);
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};
