const mongooes = require("mongoose");

let planSchema = new mongooes.Schema({
  name: {
    type: String,
    required: [true, "Kindly pass the name"],
    unique: [true, "Plan name should be unique"],
    maxlength: [40, "Your plan length is more than 40 character"],
  },

  price: {
    type: Number,
    required: [true, "You need to provide duration"],
  },

  discount: {
    type: Number,
    validate: {
      validator: function () {
        if (this.price > this.discount) {
          return true;
        } else return false;
      },
      message: "Discount must be less than actual price",
    },
  },
  duration: {
    type: Number,
    required: [true, "You Need to provide duration"],
  },
});
const FoodplanModel = mongooes.model("FoodplanModel", planSchema);
module.exports = FoodplanModel;


