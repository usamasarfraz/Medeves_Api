const mongoose = require("mongoose");

exports.userSchema = () => {
  return mongoose.Schema(
    {
      email: {
        type: String,
      },
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      password: {
        type: String,
      },
      phone: {
        type: String,
      },
      userType: {
        type: Number,
      },
      device_token: {
        type: String,
      },
    },
    {
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
  );
};

exports.storeSchema = () => {
  return mongoose.Schema(
    {
      email: {
        type: String,
      },
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      password: {
        type: String,
      },
      phone: {
        type: String,
      },
      userType: {
        type: Number,
      },
      verification: {
        type: String,
        enum: ["PENDING", "APPROVED", "DECLINED"],
        default: "PENDING",
      },
      status: {
        type: String,
        enum: ["LOGGED_IN", "LOGGED_OFF"],
        default: "LOGGED_IN",
      },
      store_name: {
        type: String,
      },
      cnic: {
        type: String,
      },
      city: {
        type: String,
      },
      address: {
        type: String,
      },
      certificate: {
        type: String,
      },
      images: {
        type: Array,
      },
      latitude: {
        type: String,
      },
      longitude: {
        type: String,
      },
      device_token: {
        type: String,
      },
    },
    {
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
  );
};

exports.riderSchema = () => {
  return mongoose.Schema(
    {
      email: {
        type: String,
      },
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      password: {
        type: String,
      },
      phone: {
        type: String,
      },
      userType: {
        type: Number,
      },
      verification: {
        type: String,
        enum: ["PENDING", "APPROVED", "DECLINED"],
        default: "PENDING",
      },
      status: {
        type: String,
        enum: ["LOGGED_IN", "LOGGED_OFF"],
        default: "LOGGED_IN",
      },
      rider_name: {
        type: String,
      },
      cnic: {
        type: String,
      },
      city: {
        type: String,
      },
      address: {
        type: String,
      },
      age: {
        type: Number,
      },
      images: {
        type: Array,
      },
      latitude: {
        type: String,
      },
      longitude: {
        type: String,
      },
      device_token: {
        type: String,
      },
    },
    {
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
  );
};

exports.orderSchema = () => {
  return mongoose.Schema(
    {
      store: {
        type: String,
      },
      client: {
        type: String,
      },
      user_name: {
        type: String,
      },
      medicines: {
        type: Array,
      },
      description: {
        type: String,
      },
      address: {
        type: String,
      },
      images: {
        type: Array,
      },
      status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "ON_THE_WAY", "REJECTED", "COMPLETED"],
        default: "PENDING",
      },
    },
    {
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
  );
};

exports.favStoreSchema = () => {
  return mongoose.Schema(
    {
      store: {
        type: String,
      },
      client: {
        type: String,
      },
      fav: {
        type: Boolean,
      },
    },
    {
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
  );
};

exports.clientAddressSchema = () => {
  return mongoose.Schema(
    {
      client: {
        type: String,
      },
      building: {
        type: String,
      },
      street: {
        type: String,
      },
      area: {
        type: String,
      },
      riderNote: {
        type: String,
      },
      latitude: {
        type: String,
      },
      longitude: {
        type: String,
      },
    },
    {
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
  );
};
