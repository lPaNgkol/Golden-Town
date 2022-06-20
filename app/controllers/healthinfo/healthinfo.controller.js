const healthinfo = require("../../models/healthinfo/healthinfo");
const authJwt = require("../../models/user/authentication");

exports.healthinfoList = async (req, res) => {
  var listHealthinfo = "";
  listHealthinfo = await healthinfo.healthinfoList(req, res);
  console.log(listHealthinfo);
  if (listHealthinfo.length == 0) {
    res.status(200).send({ code: "WEHI401", description: "Healthinfo Id Not found." });
  } else {
    res.status(200).send({
      totalRow: listHealthinfo[0].total_row,
      ListHealthinfo: listHealthinfo,

    });
  }
};

exports.healthinfoByuserId = async (req, res) => {
    var listHealthinfo = "";
    listHealthinfo = await healthinfo.healthinfoByuserId(req, res);
    console.log(listHealthinfo);
    if (listHealthinfo.length == 0) {
      res.status(200).send({ code: "WEHI401", description: "Healthinfo Id Not found." });
    } else {
      res.status(200).send({totalRow: listHealthinfo[0].total_row,
       ListHealthinfo: listHealthinfo,
        
      });
    }
  };

exports.createHealthinfo = async (req, res) => {
  var healthinfoData = "";
  if (!req.params.user_id) {
    res.status(200).send({ code: "WEHI400", description: "user_id cannot Be Null." });
  }
  healthinfoData = await healthinfo.createHealthinfo(req, res);
  if (healthinfoData.length == 0) {
    res.status(200).send({ code: "WEHI404", description: "healthinfo Id Not found." });
  } else {
    res.status(200).send({ code: "WEHI200", description: "Success" });
  }
};

// update project team
exports.updateHealthinfo = async (req, res) => {
  try {
    let healthinfoData = "";
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEHI401", description: "Access Token Expired" });
    }

    if (req.params.user_id == 0) {
      res
        .status(200)
        .send({ code: "WEHI404", description: "Project ID Not found." });
    }
    healthinfoData = await healthinfo.updateHealthinfo(req, res);
    if (healthinfoData.length == 0) {
      res
        .status(403)
        .send({ code: "WEHI403", description: "Health Info ID Not Found." });
    } else {
      res.status(200).send({ 
        code: "WEHI200", description: "Success"
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
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEHI401", description: "Access Token Expired" });
    }
    healthinfoData = await healthinfo.deleteHealthinfo(req, res);
    if (healthinfoData.length == 0) {
      res
        .status(200)
        .send({ code: "WEHI404", description: "healthinfo Id Not found." });
    }
    if (!healthinfoData.length == 0) {
      res
        .status(200)
        .send({ code: "WEHI200", description: "healthinfo Id Not found." });
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
    res
      .status(200)
      .send({ code: "WEHI404", description: "User ID Not Found" });
  } if (useridCheck == 1) {

    next();
  }
}
