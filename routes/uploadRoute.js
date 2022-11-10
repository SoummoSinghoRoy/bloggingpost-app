const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { 
  uploadProfilePicGetController, 
  uploadProfilePicPostController,
  postImageUploadController 
} = require('../controllers/uploadController');

router.get('/profile-pics', isAuthenticated, uploadProfilePicGetController)
router.post('/profile-pics',
            isAuthenticated,
            upload.single('profilePicsFile'), 
            uploadProfilePicPostController 
          )
router.post('/postimage', 
            isAuthenticated,
            upload.single('post-img'),
            postImageUploadController
          )


module.exports = router;

// 19.3 Upload Controller and Routes -- etar route handle korechi & routes.js export kore require korechi.
// 19.4 Setup Croppie JS -- etar kaj korechi create-profile.ejs & public -> script -> profilePicsUpload.js file e.
// 20.4 Tiny MCE Bachend~backend -- ekhane post er sathe je img upload hobe tar postImageUploadController er route er kaj ekhane kora hoyeche.
// 20.5 Post Validation -- etar kaj kora hoyeche validator --> dashboard --> post --> postValidator.js e.
