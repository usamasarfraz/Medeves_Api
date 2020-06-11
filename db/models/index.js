const { UserModel, StoreModel, RiderModel, OrderModel } = require("./models");

exports.User = UserModel();
exports.Store = StoreModel();
exports.Rider = RiderModel();
exports.Order = OrderModel();
