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
    type: String,
    required: [true, " name is missing"],
  },
  password: {
    type: String,
    required: [true, " password is not enterd"],
  },
  ConfirmPassword: {
    type: String,
    required: [true, "confim password is missing"],
    // custom validator
    validate: {
      validator: function () {
        // returns : true if value matched
        // returns : false if vaule is'nt matched.
        if (this.password == this.ConfirmPassword) {  // this is currunt entry enterd by user
          return true;
        } 
        else {
    
          return false;
        }
    },
            message: "password is missmatch"
    },
  },
  email: {
    type: String,
     unique : true,
    required: [true, "Email is not enterd"],
   
  },
  phoneNumber: {
    type: String,
    minLength: 10,
    max: 10,
  },
  address: {
    type: String,
  },
  pic: {
    type: String, // because route/address will add here
    default: "itachi.jpg",
  },
});
// Model is nothing but similar to collection. it create collection using set of rules .. like given below (collection= foodmodel && Schema/rules => userSchema)
const userModel = mongoose.model('FoodModel', userSchema); // this line will create model/ collection name Foodmodel who follows userSchema rules.
module.exports = userModel;         




