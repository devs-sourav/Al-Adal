const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
    },

    city: {
      cityID: {
        type: Number,
        required: [true, "City ID is required"],
      },

      cityName: {
        type: String,
        required: [true, "City name is required"],
      },
    },

    zone: {
      zoneID: {
        type: Number,
        required: [true, "Zone ID is required"],
      },

      zoneName: {
        type: String,
        required: [true, "Zone name is required"],
      },
    },

    area: {
      areaID: {
        type: Number,
        required: [true, "Area ID is required"],
      },

      areaName: {
        type: String,
        required: [true, "Area name is required"],
      },
    },

    streetAddress: {
      type: String,
      required: [true, "Street address is required"],
    },

    deliveryType: {
      type: String,
      enum: {
        values: ["normal", "on_demand"], // normal --> 48 Hours, on_demand --> 12 Hours
        message: "{VALUE} is not supported, Enter a valid delivery type",
      },
      default: "normal",
    },

    shippingCost: {
      type: Number,
      required: [true, "Shipping cost is required"],
    },

    coupon: {
      type: String,
      default: null,
    },

    couponDiscount: {
      type: Number,
      default: 0,
    },

    totalCost: {
      type: Number,
      default: 0,
    },

    orderStatus: {
      type: String,
      enum: {
        values: ["pending", "approved", "shipped", "delivered", "canceled"],
        message: "{VALUE} is not supported, Enter a valid order status",
      },
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "credit_card"],
      default: "cash_on_delivery",
    },

    notes: {
      type: String,
      default: "",
    },

    products: [
      {
        option: {
          type: Schema.Types.ObjectId, // Product Option ID
          ref: "Option",
          required: [true, "Product is required"],
        },

        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);
module.exports = Order;
