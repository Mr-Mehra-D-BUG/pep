const userModel = require("../Model/userModel");

async function profileController(req, res) {
  try {
    // let data = req.body;
    // let { email } = data;
    // let user = await userModel.findOne({ email: email });   // using email id
    // let id = user["_id"];
    //  console.log(user);

    // req.userId object created by protectRout ( if any route change in req object then that change will occures for all route )
    const id = req.userId;
    let user = await userModel.findById(id); // finding user by using id of user
    console.log(user);

    res.send({
      data: user,
      message: "This the user who loged in.",
    });
  } catch (error) {
    res.send(error.message);
  }
}

async function getAlluserController(req, res) {
  try {
    let users = await userModel.find();
    // console.log(users);
    res.json(users); // to send json data
  } catch (error) {
    res.end(err.message);
  }
}


module.exports = {
  profileController: profileController,
  getAlluserController: getAlluserController
};