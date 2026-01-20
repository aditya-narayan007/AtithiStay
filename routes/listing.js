const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middleware");
const { listingSchema } = require("../schema");
const listings = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

/* =====================
   VALIDATION
===================== */
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    req.flash("error", msg);
    return res.redirect("back");
  }
  next();
};

/* =====================
   ROUTES
===================== */

// INDEX + CREATE
router.route("/")
  .get(wrapAsync(listings.index))
  .post(
    isLoggedIn,
    upload.single("image"),   // ✅ FIRST multer
    validateListing,          // ✅ THEN Joi
    wrapAsync(listings.createListing)
  );

// NEW
router.get("/new", isLoggedIn, listings.renderNewForm);

// SHOW + UPDATE + DELETE
router.route("/:id")
  .get(wrapAsync(listings.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),   // ✅ FIRST multer
    validateListing,
    wrapAsync(listings.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listings.deleteListing));

// EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listings.renderEditForm));

module.exports = router;