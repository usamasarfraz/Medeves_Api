const {
  UserModel,
  StoreModel,
  RiderModel,
  OrderModel,
  FavStoreModel,
  ClientAddressModel,
  RiderNotificationModel,
} = require("./models");

exports.User = UserModel();
exports.Store = StoreModel();
exports.Rider = RiderModel();
exports.Order = OrderModel();
exports.FavStore = FavStoreModel();
exports.ClientAddress = ClientAddressModel();
exports.RiderNotification = RiderNotificationModel();
