const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,

  image: {
    url: String,
    filename: String
  },

  price: {
    type: Number,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  country: {
    type: String,
    required: true
  },

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (arr) {
          return (
            Array.isArray(arr) &&
            arr.length === 2 &&
            arr.every(n => typeof n === "number" && !isNaN(n))
          );
        },
        message: "Coordinates must be [lng, lat] as numbers"
      }
    }
  },

  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

/* 🔥 REQUIRED FOR GEO QUERIES */
listingSchema.index({ geometry: "2dsphere" });

/* 🔥 CLEANUP REVIEWS ON DELETE */
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);