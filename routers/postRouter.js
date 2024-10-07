const express = require("express");
const router = express.Router();
const db = require("../modules/db.js")

router.post("/signup", (req, res) => {
    const {firstname , lastname} = req.body
    db.query("SELECT * FROM user WHERE firstname = ?",[firstname], (err, info) => {
        console.log(info);
        // if (firstname === info.firstname && lastname === info.lastname) {
        //     db.query("SELECT * FROM user_details WHERE firstname = ?", [firstname] , (err, details) => {
        //         res.send(details)
        //     })
        // } else {
        // }
        db.query("INSERT INTO users (firstname, lastname) VALUES (? ,? )",[firstname , lastname], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.cookie("user_firstname", `${firstname}`)
                res.redirect("/dashboard")
            }
        } )
    })
})

router.post("/addContacts", (req, res) => {
    const {firstname , lastname , number , email , description} = req.body
    const {user_name } = req.cookies
    db.query("INSERT INTO user_details (firstname , lastname , number , email , description , user_firstname) VALUES ( ?, ?, ?, ?, ?, ?)", [firstname , lastname , number , email , description, user_name], (err , result) => {
        if (err) {
            console.error(err);
        } else {
            console.log(result);
            res.send(result)
        }
    })
})

module.exports = router;