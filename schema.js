const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    location: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    price: Joi.number().min(0).required()
    // ❌ image REMOVED from Joi
  }).required()
}).options({ abortEarly: false });

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