const Listing = require("../models/listing");
//const geocodingClient = require("../utils/geocoder");
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// const geocodingClient = mbxGeocoding({
//   accessToken: process.env.MAP_TOKEN
// });

// INDEX
module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
};

// NEW
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// CREATE
const geocodingClient = require("../utils/geocoder");

module.exports.createListing = async (req, res) => {
  const { location, country } = req.body.listing;

  // 🔹 Convert location text → coordinates
  const geoData = await geocodingClient
    .forwardGeocode({
      query: `${location}, ${country}`,
      limit: 1
    })
    .send();

  if (!geoData.body.features.length) {
    req.flash("error", "Invalid location");
    return res.redirect("/listings/new");
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  // ✅ REAL coordinates for ANY city
  newListing.geometry = {
    type: "Point",
    coordinates: geoData.body.features[0].geometry.coordinates
  };

  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};
// EDIT
module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image?.url?.replace("/upload", "/upload/w_300");
  res.render("listings/edit", { listing, originalImageUrl });
};

// UPDATE
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, country } = req.body.listing;

    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // 🔥 IF location OR country changed → re-geocode
    if (
      location !== listing.location ||
      country !== listing.country
    ) {
      const geoData = await geocodingClient
        .forwardGeocode({
          query: `${location}, ${country}`,
          limit: 1
        })
        .send();

      if (!geoData.body.features.length) {
        req.flash("error", "Invalid location");
        return res.redirect(`/listings/${id}/edit`);
      }

      listing.geometry = {
        type: "Point",
        coordinates: geoData.body.features[0].geometry.coordinates
      };
    }

    // 🔹 Update normal fields
    listing.set(req.body.listing);

    // 🔹 Update image if new image uploaded
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await listing.save();
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);

  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while updating listing");
    res.redirect("/listings");
  }
};
// DELETE
module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

// SHOW
module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};