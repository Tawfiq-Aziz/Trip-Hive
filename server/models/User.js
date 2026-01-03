import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    _id: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    image: {type: String, default: "https://via.placeholder.com/150"},
    role: {type: String, enum: ["user", "hotelOwner"], default: "user"},
    recentSerachCities: [{type :String, required: true}],
},{timeStamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;