const express = require("express");
const router = express.Router();
const db = require("../modules/db.js")

router.get("/dashboard", (req, res) => {
    const user_name = req.cookies.user_name;
    res.json({ user_name });
})
router.get("/", (req, res) => {
    res.jsonp("main page")
})

router.get("/getInfos", (req, res) => {
    db.query(`SELECT * FROM user_details WHERE user_firstname = '${req.cookies.user_name}'`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result)
        }
    })
})

router.get("/logout", (req, res) => {
    res.clearCookie("user_firstname")
    res.redirect("/")
})

module.exports = router;