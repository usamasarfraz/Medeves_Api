const mongoose = require("mongoose");
const {
  userSchema,
  storeSchema,
  riderSchema,
  orderSchema,
  favStoreSchema,
  clientAddressSchema,
  riderNotificationSchema,
  storeAccountDetailSchema,
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

exports.FavStoreModel = () => {
  return mongoose.model("fav_store", favStoreSchema());
};

exports.ClientAddressModel = () => {
  return mongoose.model("client_address", clientAddressSchema());
};

exports.RiderNotificationModel = () => {
  return mongoose.model("rider_notification", riderNotificationSchema());
};

exports.StoreAccountDetailModel = () => {
  return mongoose.model("store_account_detail", storeAccountDetailSchema());
};