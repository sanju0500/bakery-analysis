import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: String,
  lastUpdatedDateTime: Date,
  itemType: String,
  orderState: String,
  value: Number,
  branchId: Number,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
