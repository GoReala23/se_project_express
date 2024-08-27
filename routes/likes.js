const express = require("express");
const { celebrate, Joi } = require("celebrate");
const { likeItem, unlikeItem } = require("../controllers/likes");

const router = express.Router();

// Route to like an item
router.put(
  "/:id/likes",
  celebrate({
    params: Joi.object().keys({
      id: Joi.alternatives()
        .try(
          Joi.string().alphanum().length(24), // MongoDB ObjectID
          Joi.string().required() // Custom ID for default items
        )
        .required(),
    }),
  }),
  likeItem
);

// Route to unlike an item
router.delete(
  "/:id/likes",
  celebrate({
    params: Joi.object().keys({
      id: Joi.alternatives()
        .try(
          Joi.string().alphanum().length(24), // MongoDB ObjectID
          Joi.string().required() // Custom ID for default items
        )
        .required(),
    }),
  }),
  unlikeItem
);

module.exports = router;
