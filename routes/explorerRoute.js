const router = require('express').Router();

const { explorerGetController,
        singlePostPageGetController
      } = require('../controllers/explorerController');

router.get('/:postId', singlePostPageGetController,
);

router.get('/', explorerGetController);


module.exports = router;
