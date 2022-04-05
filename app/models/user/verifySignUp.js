const db = require("../../models/dbconnection");
const ROLES = db.ROLES;
const User = db.users;

checkDuplicateUsername = (req, res, next) => {
  // Username
  const query = "SELECT * FROM users WHERE username=$1 AND active=$2 ORDER BY id DESC"
  const dataquery = [req.body.username, "T"];
  pool.query(query, dataquery).then((results) => {
    console.log(results)
    if(results.rows.length>0){
        var ret = {"code":400,"description":"Username already in use"}
        response.status(400).json(ret)
        return
    }else{
        return
    }
  })
    .catch(error => {
        console.log(error)
  });
};

createAccount = (req, res) => {

}
const verifySignUp = {
    checkDuplicateUsername: checkDuplicateUsername,
    createAccount: createAccount
};
module.exports = verifySignUp;