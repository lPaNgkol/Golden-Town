const db = require("../../models/dbconnection");
const config = require("../../config/auth.config");
const authJwt = require("../../models/user/authentication");
const employee = require("../../models/user/employee");
var jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  // Save User to Database
  user = await employee.createAccount(req, res)
  if (!user) {
      res.status(500).send({code:"WEUS500", message: "Internal error." });
  }else{
    res.status(200).send({
      code:"WEUS200",
      message: "Register complete."
    });
  }
};

exports.signin = async (req, res) => {
  var user = ""
  user = await authJwt.signIn(req)
  user = user[0]
  if (!user) {
     return res.status(404).send({code:"WEUS404", message: "User Not found." });
  }
  var passwordIsValid = false
  if(user.password==req.body.password){
    passwordIsValid = true
  }
  if (!passwordIsValid) {
    return res.status(401).send({
      code:"WEUS401",
      accessToken: null,
      message: "Invalid Password!"
    });
  }
  const token = jwt.sign({ id: user.user_id }, config.secret, {
    expiresIn: config.jwtExpiration
  });
  let refreshToken = await authJwt.createRefresh(user.user_id);
  var authorities = [];
  let roles = await authJwt.getRoles(user.user_id);
  for (let i = 0; i < roles.length; i++) {
    authorities.push("ROLE_" + roles[i].name.toUpperCase());
  }
  res.status(200).send({
    code:"WEUS200",
    user_id: user.user_id,
    employee_id: user.employee_id,
    username: user.username,
    roles: authorities,
    accessToken: token,
    refreshToken: refreshToken
  });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({code:"WEUS403", message: "Refresh Token is required!" });
  }
  try {
    let refreshToken = await authJwt.getRefreshToken(requestToken);
    console.log(refreshToken)
    if (!refreshToken) {
      res.status(403).json({code:"WEUS403", message: "Refresh token is not in database!" });
      return;
    }else if(refreshToken=="expire"){
      res.status(403).json({
        code:"WEUS403",
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }else{
      return res.status(200).json({
        code:"WEUS200",
        accessToken: refreshToken.accessToken,
        refreshToken: refreshToken.refreshToken,
      });
    }
    
  } catch (err) {
    return res.status(500).send({code:"WEUS500", message: err });
  }
};

exports.logout = async (req, res) => {
  await authJwt.logout(req, res)
};

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};