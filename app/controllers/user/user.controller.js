const user = require("../../models/user/user");

exports.userLogin = async (req, res) => {
  var listUserLogin = "";
  listUserLogin = await user.userLogin(req, res);
  if (listUserLogin.length == 0) {
    res.status(404).send({
      code: "USER404",
      description: "User Not found."
    });
  } else {
    res.status(200).send({
      code: "USER200",
      user_id: listUserLogin[0].user_id,
      username: listUserLogin[0].username,
      password: listUserLogin[0].password,
      firstname: listUserLogin[0].firstname,
      lastname: listUserLogin[0].lastname,
      gender: listUserLogin[0].gender,
      email: listUserLogin[0].email,
    });
  };
};

exports.userEmail = async (req, res) => {
  var listUserEmail = "";
  listUserEmail = await user.userEmail(req, res);
  if (listUserEmail.length == 0) {
    res.status(404).send({
      code: "USER404",
      description: "Email User Doesn't Match."
    });
  } else {
    res.status(200).send({
      code: "USER200",
      description: "Email User Match!",
      number_random: listUserEmail[0].number_random,
    });
  };
};

exports.userOTP = async (req, res) => {
  var listUserOTP = "";
  listUserOTP = await user.userOTP(req, res);
  if (listUserOTP.length == 0) {
    res.status(404).send({
      code: "USER404",
      description: "OTP User Doesn't Match."
    });
  } else {
    res.status(200).send({
      code: "USER200",
      description: "OTP User Match!",
      user_id: listUserOTP[0].user_id,
    });
  };
};

exports.userList = async (req, res) => {
  var listUser = "";
  listUser = await user.userList(req, res);
  if (listUser.length == 0) {
    res.status(404).send({
      code: "USER404",
      description: "User Not found."
    });
  } else {
    res.status(200).send({
      code: "USER200",
      total: listUser.length,
      listUser: listUser,
    });
  };
};

exports.userListUserId = async (req, res) => {
  var listUserId = "";
  listUserId = await user.userListUserId(req, res);
  if (listUserId.length == 0) {
    res.status(404).send({
      code: "USER404",
      description: "User Id Not found."
    });
  } else {
    res.status(200).send({
      code: "USER200",
      total: listUserId.length,
      listUser: listUserId,
    });
  };
};

exports.userCreate = async (req, res) => {
  var createUser = "";
  if (!req.body.password) {
    res.status(200).send({
      code: "USER404",
      description: "Password doesn't match."
    });
  } else {
    createUser = await user.userCreate(req, res);
    if (createUser.length == 0) {
      res.status(404).send({
        code: "USER404",
        description: "User Not found."
      });
    } else {
      res.status(200).send({
        user_id: createUser,
        code: "USER200",
        description: "Create User Success."
      });
    };
  };
};

exports.userUpdate = async (req, res) => {
  var updateUser = "";
  updateUser = await user.userUpdate(req, res);
  if (updateUser.length == 0) {
    res.status(404).send({
      code: "USER404",
      description: "User Not found."
    });
  } else {
    res.status(200).send({
      code: "USER200",
      description: "Update User Success."
    });
  };
};

exports.userUpdatePassword = async (req, res) => {
  var updateUserPassword = "";
  if (!req.body.password) {
    res.status(200).send({
      code: "USER404",
      description: "Password doesn't match."
    });
  } else {
    updateUserPassword = await user.userUpdatePassword(req, res);
    if (updateUserPassword.length == 0) {
      res.status(404).send({
        code: "USER404",
        description: "User Not found."
      });
    } else {
      res.status(200).send({
        code: "USER200",
        description: "Update Password Success."
      });
    };
  };
};