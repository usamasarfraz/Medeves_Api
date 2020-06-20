const { UserModel, StoreModel, RiderModel, OrderModel, FavStoreModel, ClientAddressModel } = require("./models");

exports.User = UserModel();
exports.Store = StoreModel();
exports.Rider = RiderModel();
exports.Order = OrderModel();
exports.FavStore = FavStoreModel();
exports.ClientAddress = ClientAddressModel();
