const FoodModel = require("../Model/planModel");


async function createPlanController(req ,res){
  try{
   const planObjData = req.body;
   let isObjData = Object.keys(planObjData).length > 0;
   if (isObjData) {
     const newPlan = await FoodModel.create(planObjData);
     res.status(201).json({
       newPlan,
       result: "plan created",
     });
   } else {
     res.status(400).json({
       result: "data not available",
     });
   }
  } catch(err){
    res.status(500).json({
        error : err.message
    })
  }
}

async function getAllPlansController(req , res){
   try{
      const  allPlans = await FoodModel.find();  
      console.log(allPlans);
    res.status(201).json({
        result : "all food Plans ",
         allPlans
    })
   } catch(err){
      res.status(500).json({
        error: err.message,
      });
   }
}


async function getPlanController(req, res) {
   try{   
           const planID = req.params.objID;
           console.log(planID);
           const foodPlan = await FoodModel.findById(planID);
            res.status(201).json({
                result : "Plan with given id ",
                Plan : foodPlan
            })
       
   } catch(err){
       res.status(500).json({
        error : err.message
       })
   }

}
 async function updatePlanController(req, res ){

 }

 async function deletePlanController(req, res) {

 }


 module.exports = {
 getAllPlansController,
 getPlanController,
 updatePlanController,
 createPlanController,
 deletePlanController,     


 };