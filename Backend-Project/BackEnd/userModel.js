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
let dbLink =
  "mongodb+srv://ItsCodewithDEv:vo3KOPl7ru1MTayf@cluster0.pcgdr.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dbLink)
  .then(function () {
    console.log("connected");
  })
  .catch(function () {
    console.log("erroe , err");
  });
