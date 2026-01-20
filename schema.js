const Joi = require("joi");

/* =====================
   LISTING VALIDATION
===================== */
const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    location: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    price: Joi.number().min(0).required(),

    // ✅ allow extra fields like image, geometry (handled by multer/mapbox)
  }).unknown(true)   // 🔥 IMPORTANT LINE
}).options({ abortEarly: false });

/* =====================
   REVIEW VALIDATION
===================== */
const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().trim().required()
  }).required()
}).options({ abortEarly: false });

module.exports = {
  listingSchema,
  reviewSchema
};