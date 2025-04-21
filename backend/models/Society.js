const mongoose = require("mongoose");

const societySchema = new mongoose.Schema({
    name: String,
    location: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
});

module.exports = mongoose.model("Society", societySchema); 