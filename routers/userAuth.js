const express = require("express");
const router = express.Router();
const db = require("../modules/db.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { log } = require("console");

function userExists(firstname, email, callback) {
    db.query("SELECT * FROM users WHERE firstname = ? OR email = ?", [firstname, email], (error, users) => {
        if (error) {
            console.error("Error checking if user exists:", error);
            return callback(error);
        }
        const exists = users.some(user => user.firstname === firstname && user.email === email);
        callback(null, exists);
    });
}

function userCreate(firstname, email, verificationToken, callback) {
    db.query("INSERT INTO users (firstname, email, verified, verification_token) VALUES (?, ?, false, ?)", [firstname, email, verificationToken], (error, response) => {
        if (error) {
            console.error("Error creating user:", error);
            return callback(error);
        }
        callback(null, response);
    });
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "abduhakimovabdushukur@gmail.com",
        pass: "mnfy juxw codl ttro",
    },
});

router.post("/signup", (req, res) => {
    const { firstname, email } = req.body;
    userExists(firstname, email, (error, userExists) => {
        if (error) {
            console.error("Error during signup:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }
        const verificationToken = crypto.randomBytes(32).toString("hex");
        userCreate(firstname, email, verificationToken, (error, response) => {
            if (error) {
                console.error("Error during signup:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
            const verificationUrl = `http://localhost:2000/user/verification/${verificationToken}`;
            transporter.sendMail({
                from: 'abduhakimovabdushukur@gmail.com',
                to: email, 
                subject: "Verify Email and Redirect Dashboard",
                html: `<p><a href="${verificationUrl}">Click here to verify your email and switch to the dashboard</a></p>`
            }, (error) => {
                if (error) {
                    console.error("Error sending verification email:", error);
                    return res.status(500).json({ message: "Internal server error" });
                }
                res.cookie("user_name", firstname);
                res.redirect(`/verification/${verificationToken}`);
            });
        });
    });
});


router.get("/verification/:token", (req, res) => {
    const token = req.params.token;
    db.query("SELECT * FROM users WHERE verification_token = ?", [token], (error, users) => {
        if (error) {
            console.error("Error during email verification:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        const user = users[0];
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.cookie("user_name", `${user.firstname}`);
        res.redirect(`http://localhost:8080/dashboard`);
        db.query("UPDATE users SET verified = true, verification_token = NULL WHERE id = ?", [user.id], (error) => {
            if (error) {
                console.error("Error updating user verification status:", error);
            }
        });
    });
});


router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM user_details WHERE id = ?', [id], (error, result) => {
        if (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.json({ message: "User deleted successfully", data:{result} });
    })
})


module.exports = router;
