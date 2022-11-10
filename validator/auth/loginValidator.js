const {body} = require('express-validator');

module.exports = [
  body('email')
      .not().isEmpty().withMessage(`Email can't be empty`),
  body('password')
      .not().isEmpty().withMessage(`Password can't be empty`)
]
