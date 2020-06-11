const express = require("express");
const { User, Store, Rider, Order } = require("../db/models/index");
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
  let query = { verification: "APPROVED" };
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
        res.send({
          status: true,
          result,
        });
        return;
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

module.exports = router;
