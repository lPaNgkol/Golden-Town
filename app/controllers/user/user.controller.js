const db = require("../../models/dbconnection");
const config = require("../../config/auth.config");
const authJwt = require("../../models/user/authentication");
var jwt = require("jsonwebtoken");
var crypto = require('crypto');
exports.signup = (req, res) => {
  // Save User to Database
  var aDatetime = new Date();
  aDatetime = aDatetime.split("T")
  var dateNow = aDatetime[0] + " " + aDatetime[1]
  Users.create({
    username: req.body.username,
    password: crypto.createHash('md5').update(req.body.password).digest("hex"),
    employeeId: req.body.employeeId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nickName: req.body.nickName,
    gender: req.body.firstName=="ชาย" ? "M" : "F",
    dob: req.body.dob,
    jobStartDate: req.body.dob,
    workingStatus: req.body.workingStatus,
    positionId: req.body.positionId,
    mobileNo: req.body.mobileNo,
    companyId: req.body.companyId,
    workStartTime: req.body.workStartTime,
    workStopTime: req.body.workStopTime,
    workHours: req.body.workHours,
    imageUrl: req.body.imageUrl,
    active: "T",
    createBy: req.body.createBy,
    createDate: dateNow,
    updateBy: req.body.updateBy,
    updateDate: dateNow
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
exports.signin = async (req, res) => {
    var user = ""
    user = await authJwt.signIn(req)
    user = user[0]
    if (!user) {
        return res.status(404).send({ message: "User Not found." });
    }
    var passwordIsValid = false
    if(user.password==crypto.createHash('md5').update(req.body.password).digest("hex")){
        passwordIsValid = true
    }
    if (!passwordIsValid) {
        return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
        });
    }
    const token = jwt.sign({ id: user.user_id }, config.secret, {
        expiresIn: config.jwtExpiration
    });
    let refreshToken = await authJwt.createRefresh(user.user_id);
    console.log(refreshToken)
    var authorities = [];
    let roles = await authJwt.getRoles(user.user_id);
    console.log(roles)
    for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }
    res.status(200).send({
        userId: user.user_id,
        employeeId: user.employeeid,
        username: user.username,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  try {
    let refreshToken = await authJwt.getRefreshToken(requestToken);
    console.log(refreshToken)
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }else if(refreshToken=="expire"){
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }else{
      return res.status(200).json({
        accessToken: refreshToken.accessToken,
        refreshToken: refreshToken.refreshToken,
      });
    }
    
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};