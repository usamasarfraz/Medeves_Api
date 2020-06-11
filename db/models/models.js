const mongoose = require("mongoose");
const {
  userSchema,
  storeSchema,
  riderSchema,
  orderSchema,
} = require("../schemas/schemas");

exports.UserModel = () => {
  return mongoose.model("user", userSchema());
};

exports.StoreModel = () => {
  return mongoose.model("store", storeSchema());
};

exports.RiderModel = () => {
  return mongoose.model("rider", riderSchema());
};

exports.OrderModel = () => {
  return mongoose.model("order", orderSchema());
};
