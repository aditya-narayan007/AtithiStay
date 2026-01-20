const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middleware");
const { listingSchema } = require("../schema");
const listings = require("../controllers/listings");
const multer = require('multer');
const {storage} = require("../cloudConfig.js"); 
const upload = multer({storage});
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

// =====================
// VALIDATION
// =====================
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    req.flash("error", msg);
    return res.redirect("back");
  }
  next(); // ✅ DO NOT overwrite req.body
};

// =====================
// ROUTES
// =====================

// INDEX + CREATE
router.route("/")
    .get(wrapAsync(listings.index))
    //.post(isLoggedIn, validateListing, wrapAsync(listings.createListing));
    .post(isLoggedIn,upload.single('image'),validateListing,wrapAsync(listings.createListing));

// NEW
router.get("/new", isLoggedIn, listings.renderNewForm);

// SHOW + UPDATE + DELETE
router.route("/:id")
    .get(wrapAsync(listings.showListing))
    .put(isLoggedIn, isOwner,validateListing,upload.single("image"),  wrapAsync(listings.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listings.deleteListing));

// EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listings.renderEditForm));

module.exports = router;
