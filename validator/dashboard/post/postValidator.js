const { body } = require('express-validator');
const cheerio = require('cheerio');

module.exports = [
  body('title')
      .notEmpty().withMessage(`title can't be empty`)
      .isLength({max: 100}).withMessage(`title must be less then 100 chars`)
      .trim()
  ,
  body('body')
      .notEmpty().withMessage(`post body can't be empty`)
      .custom(value => {
        const $ = cheerio.load(value);
        const postBody = $.text()

        if(postBody.length > 5000) {
          throw new Error(`body must be less then 5000 chars`)
        }
        return true
      })
  ,
  body('tags')
      .notEmpty().withMessage(`tags can't be empty`)
]
