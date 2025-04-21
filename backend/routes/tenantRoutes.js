const express = require("express");
const router = express.Router();

// GET /api/tenants
router.get("/", (req, res) => {
    res.send("Tenant route works");
});

module.exports = router; 