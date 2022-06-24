const position = require("../../models/position/position");
const authJwt = require("../../models/user/authentication");

exports.positionList = async (req, res) => {
  var listPosition = "";
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEPT401", description: "Access Token Expired" });
  }
  listPosition = await position.positionList(req, res);
  console.log(listPosition);
  if (listPosition.length == 0) {
    res
      .status(200)
      .send({ code: "WEPT404", description: "Position Id Not found." });
  } else {
    res.status(200).send({
      total: listPosition.length,
      ListPosition: listPosition,
    });
  }
};

exports.positioncompanyList = async (req, res) => {
  var listPosition = "";
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEPT401", description: "Access Token Expired" });
  }
  listPosition = await position.positioncompanyList(req, res);
  console.log(listPosition);
  if (listPosition.length == 0) {
    res
      .status(200)
      .send({ code: "WEPT404", description: "No Employee in Company." });
  } else {
    res.status(200).send({
      total: listPosition.length,
      ListPosition: listPosition,
    });
  }
};

exports.createPosition = async (req, res, next) => {
  let createProject = "";
  if (!authJwt) {
    res
      .status(200)
      .send({ code: "WEPT401", description: "Access Token Expired" });
  } else {
    createProject = await position.createPosition(req, res);
    res.status(200).send({ code: "WEPT200", description: "Success" });
  }
};

// update department
exports.updatePosition = async (req, res) => {
  try {
    var updateData = null;

    if (!req.body.position_name) {
      res.status(200).send({
        code: "WEPT400",
        description: "Position_name cannot Be Null.",
      });
    }
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEPT401", description: "Access Token Expired" });
    }
    updateData = await position.updatePosition(req, res);
    if (updateData == 0) {
      res
        .status(200)
        .send({ code: "WEPT404", description: "Position not Found." });
    } else {
      res.status(200).send({ code: "WEPT200", description: "Success" });
    }
    console.log("positionData", updateData);
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

// delete Positio
exports.deletePosition = async (req, res) => {
  if (!req.params.position_id) {
    res
      .status(200)
      .send({ code: "WEPS400", description: "Position id cannot be Null." });
  }
  let positionDl = await position.deletePosition(req, res);
  // console.log("positionDl test", positionDl.rows, req.params.position_id);
  if (positionDl != "complete") {
    res
      .status(404)
      .send({ code: "WEPS404", description: "Position id Not found." });
  } else {
    res.status(200).send({ code: "WEPS200", description: "Delete Complete!" });
  }
};



exports.positioncompanyCheck = async (req, res, next) => {
  try {
    let nameCheck = null;
    nameCheck = await position.positioncompanyCheck(req, res);
    console.log("positionnameCheck", nameCheck);
    if (nameCheck == 0) {
      res.status(400).send({ message: "Company not found" });
    }
    if (!authJwt) {
      res
        .status(200)
        .send({ code: "WEDP401", description: "Access Token Expired" });
    }
    if (nameCheck > 0) {
      next();
    }
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};

exports.departmentCheck = async (req, res, next) => {
  try {
    let nameCheck = null;
    nameCheck = await position.departmentidCheck(req, res);
    console.log("departmentidCheck", nameCheck);
    if (nameCheck == 0) {
      res.status(400).send({ message: "Department not found" });
    }
    if (nameCheck > 0) {
      next();
    }
  } catch (error) {
    console.error("### Error ", error);
    return error;
  }
};
