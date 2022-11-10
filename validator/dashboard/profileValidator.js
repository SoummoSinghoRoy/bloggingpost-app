const { body } = require('express-validator');
const validator = require('validator');

const urlValidator = value => {
  if(value) {
    if(!validator.isURL(value)) {
      throw new Error(`please provide correct url`)
    }
  }
  return true
}

module.exports = [
  body('name')
    .notEmpty().withMessage(`name can't be empty`)
    .isLength({max: 50}).withMessage(`name must be less then 50 charecter`)
    .trim()
  ,
  body('title')
    .notEmpty().withMessage(`title can't be empty`)
    .isLength({max: 100}).withMessage(`title must be less then 100 charecter`)
    .trim()
  ,
  body('bio')
    .notEmpty().withMessage(`bio can't be empty`)
    .isLength({max: 100}).withMessage(`bio must be less then 200 charecter`)
    .trim()
  ,
  body('website')
    .custom(urlValidator)
  ,
  body('facebook')
    .custom(urlValidator)
  ,
  body('twitter')
    .custom(urlValidator)
  ,
  body('userGithub')
    .custom(urlValidator)
  
]
