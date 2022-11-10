const router = require('express').Router();

const {isAuthenticated} = require('../../middleware/authMiddleware');
const {
  createCommentPostController,
  replyCommentPostController
} = require('../controllers/commentController');

const {
  blogPostLikesGetController,
  blogPostDisLikesGetController
} = require('../controllers/likeDislikeController');

const {blogPostBookmarksGetController} = require('../controllers/bookmarkController');

router.post('/comments/:postId', isAuthenticated, createCommentPostController);
router.post('/comments/replies/:commentId', isAuthenticated, replyCommentPostController);

router.get('/likes/:postId', isAuthenticated, blogPostLikesGetController);
router.get('/dislikes/:postId', isAuthenticated, blogPostDisLikesGetController);

router.get('/bookmarks/:postId', isAuthenticated, blogPostBookmarksGetController);

module.exports = router;