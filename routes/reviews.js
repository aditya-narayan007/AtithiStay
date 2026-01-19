const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isAuthor } = require("../middleware");
const { reviewSchema } = require("../schema");
const wrapAsync = require("../utils/wrapAsync");
const reviews = require("../controllers/reviews");

// =====================
// VALIDATION
// =====================
const validateReview = (req, res, next) => {
    const { error, value } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        req.flash("error", msg);
        return res.redirect("back");
    }
    req.body = value;
    next();
};

// =====================
// ROUTES
// =====================
router.route("/")
    .post(isLoggedIn, validateReview, wrapAsync(reviews.createReview));

router.route("/:reviewId")
    .delete(isLoggedIn, isAuthor, wrapAsync(reviews.deleteReview));

module.exports = router;
