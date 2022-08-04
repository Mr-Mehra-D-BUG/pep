// 1: Project Knowladge :
// User Data => Store
// Name ,
// Emial,
// Password
// Pic
// Address
// Phone Number

// 2:  Tech Knowladge ::
// (Schema) => Set of features and rules a certian entity should follow.
//  How to create dataBase ::
// Connect to my App ::
// How to create a Schema ::
// How to store Values in it ::
// mongooes :

const mongoose = require("mongoose"); 
let dbLink =  "mongodb+srv://ItsCodewithDEv:sydbWrrJORdTL3XD@cluster0.pcgdr.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(dbLink)
  .then(function () {
    console.log("connected");
  })
  .catch(function () {
    console.log("error" , 'err');
  });
  // how to define schema => those entry written here only thoes entry allow in dataBase nothing more nothing less.
let userSchema = new mongoose.Schema({
  name: {
      type : String,
      required : true,
  },
  password :{
      type : String,
      required : true,
  },
  ConfirmPassword : {
     type : String,
     required : true,
  },
  email :{
         type : String,
         required : true,
         unque : true
  },
  phoneNumber :{
      type : String,
      minLength : 10,
      max : 10,

  },
  address :{
     type : String,
  },
  pic :{
     type : String , // because route/address will add here
     default : "itachi.jpg"
  }



});

const userModel = mongoose.model('FoodModel', userSchema);
module.exports = userModel;