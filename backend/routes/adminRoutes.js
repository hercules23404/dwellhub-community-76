const express = require("express");
const router = express.Router();

// GET /api/admin
router.get("/", (req, res) => {
    res.send("Admin route works");
});

module.exports = router; 