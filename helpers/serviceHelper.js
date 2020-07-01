const {
  User,
  Store,
  Rider,
  Order,
  FavStore,
  ClientAddress,
  RiderNotification,
} = require("../db/models/index");
exports.UpdateRider = async (id, data) => {
  let updatedData = await Rider.findByIdAndUpdate(id, data, { new: true });
  return updatedData;
};

exports.CreateRiderNotification = async (data) => {
  let RegisterData = new RiderNotification(data);
  let notification = await RegisterData.save();
  return notification;
};
