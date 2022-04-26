const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");
const db = require("../../models/dbconnection");
var moment = require('moment');
const { v4: uuidv4 } = require("uuid");
const User = db.users;
const { TokenExpiredError } = jwt;
const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }
  return res.sendStatus(401).send({ message: "Unauthorized!" });
}
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.user_id = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  console.log(req.user_id)
  const query = "SELECT b.* FROM user_role a inner join role b on a.role_id=b.role_id WHERE a.user_id=$1 AND a.active=$2 AND a.role_id=1"
  const dataquery = [req.user_id, "T"];
  db.query(query, dataquery).then((results) => {
    console.log(results.rows)
    if(results.rows.length<=0){
        var ret = {"code":400,"description":"Missing Permission"}
        res.status(400).json(ret)
    }else{
      next();
    }
  }).catch(error => {
    res.status(500).send({
      message: error.message
    });
  });
};

function signIn(req){
  return new Promise(function(resolve){
    const query = "SELECT password, user_id, username, employee_id FROM users WHERE UPPER(username)=UPPER($1) AND active=$2 ORDER BY user_id DESC"
    const dataquery = [req.body.username, "T"];
    db.query(query, dataquery).then((results) => {
      if(results.rows.length>0){
        var time = moment();
        var date = time.format('YYYY-MM-DD HH:mm:ss');
        const queryLogin = "UPDATE users SET last_login=$1 WHERE user_id=$2"
        const dataqueryLogin = [date, results.rows[0]['user_id']];
        db.query(queryLogin, dataqueryLogin).then(() => {
          resolve(results.rows)
        })
        .catch(error => {
          res.status(500).send({
            message: error.message
          });
        });
      }else{
        resolve(results.rows)
      }
    })
    .catch(error => {
      res.status(500).send({
        message: error.message
      });
    });
  })
}

function createRefresh(userId){
  let expiredAt = new Date();
  expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);
  let _token = uuidv4();
  var time = moment();
  var date = time.format('YYYY-MM-DDTHH:mm:ss');
  aDatetime = String(date).split("T")
  var dateNow = aDatetime[0] + " " + aDatetime[1]
  return new Promise(function(resolve){
    const query = "INSERT INTO refresh_token(token, expiredate, user_id, createdate, updatedate) VALUES ($1, $2, $3, $4, $5);"
    const dataquery = [_token, expiredAt, userId, dateNow, dateNow];
    db.query(query, dataquery).then(() => {
      resolve(_token)
    })
    .catch(error => {
      res.status(500).send({
        message: error.message
      });
    });
  })
}

function getRoles(userId){
  return new Promise(function(resolve){
    const query = "SELECT b.name, b.role_Id FROM user_role a INNER JOIN role b on a.role_Id=b.role_Id WHERE a.user_Id=$1"
    const dataquery = [userId];
    db.query(query, dataquery).then((results) => {
        if(results.rows.length>0){
          resolve(results.rows)
        }else{
          resolve(results.rows)
        }
    }).catch(error => {
      res.status(500).send({
        message: error.message
      });
    });
  })
}

function getRefreshToken(refresh_token){
  if (refresh_token == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }else{
    return new Promise(function(resolve){
      const query = "SELECT token, expiredate, user_id, refresh_token_id FROM refresh_token WHERE token=$1 ORDER BY refresh_token_id DESC LIMIT 1"
      const dataquery = [refresh_token];
      db.query(query, dataquery).then(async (results) => {
        if(results.rows.length>0){
          var time = moment();
          var date = time.format('YYYY-MM-DDTHH:mm:ss');
          aDatetime = String(date).split("T")
          var dateNow = aDatetime[0] + " " + aDatetime[1]
          var rows = results.rows
          var user_id = rows[0].user_id
          if (rows[0].expiredate < dateNow) {
            
            const queryDeleteRefresh = "DELETE FROM refresh_token WHERE refresh_token_id=$1"
            const dataqueryDelete = [rows[0].refresh_token_id];
            db.query(queryDeleteRefresh, dataqueryDelete)
            resolve("expire")
          }else{
            let newAccessToken = jwt.sign({ id: user_id }, config.secret, {
              expiresIn: config.jwtExpiration,
            });

            let newRefresh = await createRefresh(user_id)
            resolve({
              accessToken: newAccessToken,
              refreshToken: newRefresh,
            });
          }
        }else{
          resolve()
        }
      }).catch(error => {
        res.status(500).send({
          message: error.message
        });
      });
    })
  }
}

logout = (req, res) => {
  let token = req.headers["x-access-token"];
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(500).send({
        message: err
      });
    }else{
      if(req.body.user_id==decoded.id){
        const query = "DELETE FROM refresh_token WHERE user_id=$1"
        const dataquery = [req.body.user_id];
        db.query(query, dataquery).then((results) => {
          res.status(200).send({
            message: "Logout Complete."
          });
        }).catch(error => {
          res.status(500).send({
            message: error.message
          });
        });
      }else{
        res.status(500).send({
          message: "Token not match user"
        });
      }
    }
  });
  
};

const authJwt = {
  verifyToken: verifyToken,
  signIn: signIn,
  createRefresh: createRefresh,
  getRoles: getRoles,
  getRefreshToken: getRefreshToken,
  isAdmin: isAdmin,
  logout: logout
};
module.exports = authJwt;