const router = require('express').Router()
const  { 
  
  dashboardGetController,
  createProfileGetController,
  createProfilePostController,
  editProfileGetController,
  editProfilePostController,
  bookmarksPostGetController,
  postCommentsGetController
  
 }  = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const profileValidator = require('../validator/dashboard/profileValidator');

router.get('/bookmarks', isAuthenticated, bookmarksPostGetController);

router.get('/comments', isAuthenticated, postCommentsGetController)

router.get('/create-profile', isAuthenticated, createProfileGetController);
router.post('/create-profile', 
            isAuthenticated,
            profileValidator,
            createProfilePostController);

router.get('/edit-profile', isAuthenticated, editProfileGetController);
router.post('/edit-profile', isAuthenticated, profileValidator, editProfilePostController);

router.get('/', isAuthenticated, dashboardGetController);

module.exports = router;
