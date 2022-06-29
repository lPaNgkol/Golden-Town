const healthinfo = require("../../models/healthinfo/healthinfo");
const authJwt = require("../../models/user/authentication");

exports.healthinfoList = async (req, res) => {
  var listHealthinfo = "";
  listHealthinfo = await healthinfo.healthinfoList(req, res);
  console.log(listHealthinfo);
  if (listHealthinfo.length == 0) {
    res
      .status(404)
      .send({ code: "WEHI404", description: "Healthinfo Id Not found." });
  } else {
    res.status(200).send({
      code: "WEHI200",
      total: listHealthinfo.length,
      ListHealthinfo: listHealthinfo,
    });
  }
};

exports.healthinfoByuserId = async (req, res) => {
  var listHealthinfo = "";
  listHealthinfo = await healthinfo.healthinfoByuserId(req, res);
  console.log(listHealthinfo);
  if (listHealthinfo.length == 0) {
    res
      .status(404)
      .send({ code: "WEHI404", description: "Healthinfo Id Not found." });
  } else {
    res
      .status(200)
      .send({
        code: "WEHI200",
        total: listHealthinfo.length,
        ListHealthinfo: listHealthinfo,
      });
  }
};

exports.createHealthinfo = async (req, res) => {
  if (!req.params.user_id) {
    res
      .status(200)
      .send({ code: "WEHI400", description: "user_id cannot Be Null." });
  }
  let healthinfoData = await healthinfo.createHealthinfo(req, res);
  if (healthinfoData.length == 0) {
    res
      .status(404)
      .send({ code: "WEHI404", description: "healthinfo Id Not found." });
  } else {
    res.status(200).send({ code: "WEHI200", description: "Success" });
  }
};

// update project team
exports.updateHealthinfo = async (req, res) => {
  try {
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEHI401", description: "Access Token Expired" });
    }

    if (req.params.user_id == 0) {
      res
        .status(404)
        .send({ code: "WEHI404", description: "Project ID Not found." });
    }
    let healthinfoData = await healthinfo.updateHealthinfo(req, res);
    if (healthinfoData.length == 0) {
      res
        .status(404)
        .send({ code: "WEHI404", description: "Health Info ID Not Found." });
    } else {
      res.status(200).send({
        code: "WEHI200",
        description: "Success",
        healthinfoData: healthinfoData
      });
    }
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

exports.deleteHealthinfo = async (req, res) => {
  try {
    var healthinfoData = "";
    if (!req.params.healthinfo_id) {
      res
        .status(200)
        .send({ code: "WEHI400", description: "Healthinfo  id cannot be Null." });
    }
    healthinfoData = await healthinfo.deleteHealthinfo(req, res);
    if (healthinfoData != "complete") {
      res
        .status(404)
        .send({ code: "WEHI404", description: "Healthinfo Id Not found." });
    }
    if (!healthinfoData.length == 0) {
      res.status(200).send({ code: "WEHI200", description: "Delete Complete!" });
    }
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

exports.useridCheck = async (req, res, next) => {
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEHI401", description: "Access Token Expired" });
  }
  useridCheck = await healthinfo.useridCheck(req, res, next);
  if (useridCheck == 0) {
    res.status(404).send({ code: "WEHI404", description: "User ID Not Found" });
  }
  if (useridCheck == 1) {
    next();
  }
};
