const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
    name: String,
    email: String,
});

module.exports = mongoose.model("Tenant", tenantSchema); 