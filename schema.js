'use strict';

module.exports = (() => {
  let Joi = require('joi');

  return Joi.object().keys({
    college: Joi.string().required(),
    name: Joi.string().required(),
    score: Joi.number().integer().min(0).max(100).required()
  });
})();