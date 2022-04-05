const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");
const db = require("../../models/dbconnection");
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
    req.userId = decoded.id;
    next();
  });
};

function signIn(req){
    return new Promise(function(resolve){
        const query = "SELECT password, user_id FROM users WHERE username=$1 AND active=$2 ORDER BY user_id DESC"
        const dataquery = [req.body.username, "T"];
        db.query(query, dataquery).then((results) => {
            if(results.rows.length>0){
                console.log(results)
                
                resolve(results.rows)
                
            }else{
                
                resolve(results.rows)
            }
        })
        .catch(error => {
            console.log(error)
            resolve(error)
        });
    })
}

function createRefresh(userId){
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);
    let _token = uuidv4();
    var date = new Date().toISOString().slice(0, 19);
    console.log(date);
    aDatetime = String(date).split("T")
    console.log(aDatetime);
    var dateNow = aDatetime[0] + " " + aDatetime[1]
    return new Promise(function(resolve){
        const query = "INSERT INTO refresh_token(token, expiredate, user_id, createdate, updatedate) VALUES ($1, $2, $3, $4, $5);"
        const dataquery = [_token, expiredAt, userId, dateNow, dateNow];
        db.query(query, dataquery).then(() => {
          resolve(_token)
        })
        .catch(error => {
            console.log(error)
            resolve(error)
        });
    })
}

function getRoles(userId){
    return new Promise(function(resolve){
        const query = "SELECT b.name, b.role_Id FROM user_role a INNER JOIN role b on a.role_Id=b.role_Id WHERE a.user_Id=$1"
        const dataquery = [userId];
        db.query(query, dataquery).then((results) => {
            if(results.rows.length>0){
                console.log(results)
                
                resolve(results.rows)
                
            }else{
                resolve(results.rows)
            }
        })
        .catch(error => {
            console.log(error)
            resolve(error)
        });
    })
}



const authJwt = {
  verifyToken: verifyToken,
  signIn: signIn,
  createRefresh: createRefresh,
  getRoles: getRoles
};
module.exports = authJwt;