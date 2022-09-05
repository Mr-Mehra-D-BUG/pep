const express  = require("express");
const planRouter = express.Router();

const { protectRoute } = require("../controller/authController");
const {getAllPlansController ,
     createPlanController ,
      updatePlanController , 
      deletePlanController ,
      getPlanController} = require("../controller/planController")

planRouter.route("/")
.get(getAllPlansController)
.post(createPlanController)

planRouter.route("/:objID")
.patch(updatePlanController)
.delete(deletePlanController)
.get(getPlanController)


module.exports = planRouter