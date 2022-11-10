const router = require('express').Router();
const postValidator = require('../validator/dashboard/post/postValidator');
const { isAuthenticated } = require('../middleware/authMiddleware');
const {
  createBlogPost_GetController,
  createBlogPost_PostController,
  editPostGetController,
  editPost_PostController,
  deletePostController,
  getAllPostController
} = require('../controllers/postController');
const upload = require('../middleware/uploadMiddleware');

router.get('/create', 
          isAuthenticated, 
          createBlogPost_GetController);
router.post('/create', 
            isAuthenticated, 
            upload.single('post-thumbnail'), 
            postValidator, 
            createBlogPost_PostController);

router.get('/edit/:postId', 
          isAuthenticated, 
          editPostGetController);
router.post('/edit/:postId', 
          isAuthenticated, 
          upload.single('post-thumbnail'), 
          postValidator, 
          editPost_PostController);

router.get('/delete/:postId', isAuthenticated, deletePostController);

router.get('/', isAuthenticated, getAllPostController)

module.exports = router;

