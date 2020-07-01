const express = require("express");
const ObjectId = require("mongoose").Types.ObjectId;
const md5 = require("md5");
const {
  User,
  Store,
  Rider,
  Order,
  FavStore,
  ClientAddress,
  RiderNotification,
} = require("../db/models/index");
const { upload } = require("../helpers/multer");
const { cloudinary } = require("../helpers/cloudinary");
const router = express.Router();

router.get("/get_stores_for_admin/:type", (req, res) => {
  let type = Number(req.params.type);
  let query = {};
  switch (type) {
    case 1:
      query = { verification: "PENDING" };
      break;
    case 2:
      query = { verification: "APPROVED" };
      break;
    case 3:
      query = { verification: "DECLINED" };
      break;
  }
  Store.find(query, (err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

router.put("/approve_store", (req, res) => {
  Store.findByIdAndUpdate(
    req.body.key,
    { verification: "APPROVED" },
    { new: true },
    (err, result) => {
      if (err) {
        res.send({
          status: false,
          msg: "Server Query Error.",
        });
        return;
      }
      if (result) {
        res.send({
          status: true,
          result,
        });
        return;
      }
    }
  );
});

router.put("/decline_store", (req, res) => {
  Store.findByIdAndUpdate(
    req.body.key,
    { verification: "DECLINED" },
    { new: true },
    (err, result) => {
      if (err) {
        res.send({
          status: false,
          msg: "Server Query Error.",
        });
        return;
      }
      if (result) {
        res.send({
          status: true,
          result,
        });
        return;
      }
    }
  );
});

router.get("/get_stores_for_client/:lat/:long", (req, res) => {
  let lat = req.params.lat;
  let long = req.params.long;
  let client = req.decoded.user._id;
  let query = { verification: "APPROVED" };
  Store.aggregate([
    {
      $lookup: {
        from: "fav_stores",
        localField: "_id.toHexString()",
        foreignField: "stores.toHexString()",
        as: "favorite",
      },
    },
    {
      $match: {
        verification: "APPROVED",
      },
    },
    {
      $addFields: {
        storeId: { $toString: "$_id" },
      },
    },
    {
      $addFields: {
        favorite: {
          $filter: {
            input: "$favorite",
            as: "favorite",
            cond: {
              $and: [
                { $eq: ["$$favorite.client", client] },
                { $eq: ["$$favorite.store", "$storeId"] },
              ],
            },
          },
        },
      },
    },
  ]).exec((err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

router.post("/place_order", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.send({
        status: false,
        msg: err.message,
      });
    } else {
      let data = await cloudinary(req.files);
      req.body.images = data;
      let medicines = JSON.parse(req.body.medicines);
      req.body.medicines = medicines;
      let RegisterData = new Order(req.body);
      RegisterData.save((err, result) => {
        if (err) {
          res.send({
            status: false,
            msg: "Server Query Error.",
          });
          return;
        }
        if (result) {
          res.send({
            status: true,
            msg: "Your Order Placed Successfully.",
            result,
          });
          return;
        } else {
          res.send({
            status: false,
            msg: "User Not Registered.",
          });
          return;
        }
      });
    }
  });
});

router.get("/get_orders_for_store", (req, res) => {
  let query = { store: req.decoded.user._id, status: "PENDING" };
  Order.find(query, (err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

router.get("/get_client_detail/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id, (err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

router.put("/accept_order_by_store", (req, res) => {
  let coords = [];
  let longitude = parseFloat(req.decoded.user.longitude);
  let latitude = parseFloat(req.decoded.user.latitude);
  coords[0] = longitude;
  coords[1] = latitude;

  Order.findByIdAndUpdate(
    req.body.key,
    { status: "ACCEPTED" },
    { new: true },
    (err, result) => {
      if (err) {
        res.send({
          status: false,
          msg: "Server Query Error.",
        });
        return;
      }
      if (result) {
        Rider.find(
          {
            currentLocation: {
              $near: coords,
              $maxDistance: 5,
            },
            verification: "APPROVED",
            status: "LOGGED_IN",
          },
          (err, riderData) => {
            if (riderData) {
              res.send({
                status: true,
                result,
                riderData,
              });
              return;
            }
          }
        );
      }
    }
  );
});

router.delete("/reject_order_by_store/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id, (err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

router.put("/fav_store_by_client", (req, res) => {
  let fav = req.body.fav;
  let store = req.body.store;
  let client = req.decoded.user._id;
  FavStore.findOneAndUpdate(
    { store: store, client: client },
    { store: store, client: client, fav: fav },
    { upsert: true, new: true },
    (err, result) => {
      if (err) {
        res.send({
          status: false,
          msg: "Server Query Error.",
        });
        return;
      }
      if (result) {
        res.send({
          status: true,
          result,
        });
        return;
      }
    }
  );
});

router.get("/get_favorite_stores_for_client", (req, res) => {
  let client = req.decoded.user._id;
  FavStore.aggregate([
    {
      $lookup: {
        from: "stores",
        localField: "store.toHexString()",
        foreignField: "_id.toHexString()",
        as: "storeData",
      },
    },
    {
      $match: {
        client: client,
        fav: true,
      },
    },
    {
      $addFields: {
        storeData: {
          $filter: {
            input: "$storeData",
            as: "storeData",
            cond: {
              $eq: [{ $toString: "$$storeData._id" }, "$store"],
            },
          },
        },
      },
    },
    {
      $unwind: "$storeData",
    },
    {
      $project: {
        _id: "$storeData._id",
        email: "$storeData.email",
        firstName: "$storeData.firstName",
        lastName: "$storeData.lastName",
        phone: "$storeData.phone",
        userType: "$storeData.userType",
        verification: "$storeData.verification",
        status: "$storeData.status",
        store_name: "$storeData.store_name",
        cnic: "$storeData.cnic",
        city: "$storeData.city",
        address: "$storeData.address",
        certificate: "$storeData.certificate",
        images: "$storeData.images",
        latitude: "$storeData.latitude",
        longitude: "$storeData.longitude",
        device_token: "$storeData.device_token",
        favorite: [{ client: "$client", store: "$store", fav: "$fav" }],
      },
    },
  ]).exec((err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

router.get("/get_past_orders", (req, res) => {
  let id = req.decoded.user._id;
  Order.aggregate([
    {
      $lookup: {
        from: "stores",
        localField: "store.toHexString()",
        foreignField: "_id.toHexString()",
        as: "storeData",
      },
    },
    {
      $match: {
        client: id,
        status: "COMPLETED",
      },
    },
    {
      $addFields: {
        storeData: {
          $filter: {
            input: "$storeData",
            as: "storeData",
            cond: {
              $eq: [{ $toString: "$$storeData._id" }, "$store"],
            },
          },
        },
      },
    },
    {
      $unwind: "$storeData",
    },
    {
      $addFields: {
        store_name: "$storeData.store_name",
      },
    },
  ]).exec((err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

router.put("/update_client_info", (req, res) => {
  let client = req.decoded.user._id;
  User.findByIdAndUpdate(client, req.body, { new: true }, (err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        user: result,
      });
      return;
    }
  });
});

router.put("/update_client_password", (req, res) => {
  let client = req.decoded.user._id;
  let pwd = req.body.password;
  let enc_pwd = pwd ? md5(pwd) : null;
  let new_pwd = req.body.newPassword;
  let new_enc_pwd = new_pwd ? md5(new_pwd) : null;
  let query = { _id: client, password: enc_pwd };
  User.findOneAndUpdate(
    query,
    { password: new_enc_pwd },
    { new: true },
    (err, result) => {
      if (err) {
        res.send({
          status: false,
          msg: "Server Query Error.",
        });
        return;
      }
      if (result) {
        res.send({
          status: true,
          msg: "Password Changed Successfully.",
        });
        return;
      } else {
        res.send({
          status: false,
          msg: "Incorrect Password.",
        });
        return;
      }
    }
  );
});

router.get("/get_client_addresses", (req, res) => {
  let client = req.decoded.user._id;
  let query = { client: client };
  ClientAddress.find(query, (err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

router.post("/add_client_address", (req, res) => {
  let RegisterData = new ClientAddress(req.body);
  RegisterData.save((err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        msg: "Your Address Added Successfully.",
        result,
      });
      return;
    }
  });
});

router.put("/update_client_address", (req, res) => {
  let id = req.body._id;
  ClientAddress.findByIdAndUpdate(
    id,
    req.body,
    { new: true },
    (err, result) => {
      if (err) {
        res.send({
          status: false,
          msg: "Server Query Error.",
        });
        return;
      }
      if (result) {
        res.send({
          status: true,
          result,
        });
        return;
      }
    }
  );
});

router.delete("/remove_client_address/:id", (req, res) => {
  ClientAddress.findByIdAndRemove(req.params.id, (err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

router.get("/get_riders_for_admin/:type", (req, res) => {
  let type = Number(req.params.type);
  let query = {};
  switch (type) {
    case 1:
      query = { verification: "PENDING" };
      break;
    case 2:
      query = { verification: "APPROVED" };
      break;
    case 3:
      query = { verification: "DECLINED" };
      break;
  }
  Rider.find(query, (err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

router.put("/approve_rider", (req, res) => {
  Rider.findByIdAndUpdate(
    req.body.key,
    { verification: "APPROVED" },
    { new: true },
    (err, result) => {
      if (err) {
        res.send({
          status: false,
          msg: "Server Query Error.",
        });
        return;
      }
      if (result) {
        res.send({
          status: true,
          result,
        });
        return;
      }
    }
  );
});

router.put("/decline_rider", (req, res) => {
  Rider.findByIdAndUpdate(
    req.body.key,
    { verification: "DECLINED" },
    { new: true },
    (err, result) => {
      if (err) {
        res.send({
          status: false,
          msg: "Server Query Error.",
        });
        return;
      }
      if (result) {
        res.send({
          status: true,
          result,
        });
        return;
      }
    }
  );
});

router.get("/get_notifications_for_rider", (req, res) => {
  let query = { rider: req.decoded.user._id };
  RiderNotification.find(query, (err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

router.get("/get_number_of_unread_notifications_for_rider", (req, res) => {
  let query = { rider: req.decoded.user._id, read: false };
  RiderNotification.find(query, (err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

router.post("/get_order_detail_for_rider", async (req, res) => {
  let rider = req.decoded.user._id;
  let order = ObjectId(req.body.order);
  let riderNotificationId = req.body._id;
  await RiderNotification.findByIdAndUpdate(riderNotificationId,{read: true});
  Order.aggregate([
    {
      $lookup: {
        from: "stores",
        localField: "store.toHexString()",
        foreignField: "_id.toHexString()",
        as: "storeData",
      },
    },
    {
      $match: {
        _id: order
      },
    },
    {
      $addFields: {
        storeData: {
          $filter: {
            input: "$storeData",
            as: "storeData",
            cond: {
              $eq: [{ $toString: "$$storeData._id" }, "$store"],
            },
          },
        },
      },
    },
    {
      $unwind: "$storeData",
    },
    {
      $addFields: {
        store_name: "$storeData.store_name",
        store_phone: "$storeData.phone",
        store_address: "$storeData.address",
        store_latitude: "$storeData.latitude",
        store_longitude: "$storeData.longitude",
      },
    },
  ]).exec((err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

router.get("/get_accepted_orders_for_store", (req, res) => {
  let query = { store: req.decoded.user._id, status: "ACCEPTED" };
  Order.find(query, (err, result) => {
    if (err) {
      res.send({
        status: false,
        msg: "Server Query Error.",
      });
      return;
    }
    if (result) {
      res.send({
        status: true,
        result,
      });
      return;
    }
  });
});

module.exports = router;
