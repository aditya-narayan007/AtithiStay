const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const users = require("../controllers/users");

// =====================
// SIGNUP
// =====================
router.route("/signup")
    .get(users.renderSignup)
    .post(users.signup);

// =====================
// LOGIN
// =====================
router.route("/login")
    .get(users.renderLogin)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login"
        }),
        users.login
    );

// =====================
// LOGOUT
// =====================
router.get("/logout", users.logout);

module.exports = router;
