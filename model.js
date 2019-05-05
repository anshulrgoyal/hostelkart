var mongoose = require("mongoose");
var status=['pending','accepted','shipped','outFordelivery','atSeller']
var couponSchema = new mongoose.Schema({ 
  name: String,
  hostel: String,
  room: String,
  type: String,
  colg: String,
  time: String,
  date: String,
  number: String,
  paid:String,
  bookid:Number,
  email:String,
  comment:String,
}
)
module.exports = mongoose.model("buy",couponSchema)
