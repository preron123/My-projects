const express = require('express');
const router = express.Router();
const ShorturlController = require("../controllers/ShorturlController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
// ===========================================================
router.post("/url/shorten",ShorturlController.createUrl)

router.get("/:urlCode", ShorturlController.getUri)



module.exports = router;