const router = require('express').Router();
const signupValidator = require('../validator/auth/signupValidator');
const loginValidator = require('../validator/auth/loginValidator');

const {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  logoutController,
  changePasswordGetController,
  changePasswordPostController

} = require('../controllers/authController');

const { isUnAuthenticated, isAuthenticated } = require('../middleware/authMiddleware');

router.get('/signup', isUnAuthenticated, signupGetController);
router.post('/signup', isUnAuthenticated, signupValidator, signupPostController);

router.get('/changepassword', isAuthenticated, changePasswordGetController);
router.post('/changepassword', isAuthenticated, changePasswordPostController);

router.get('/login', isUnAuthenticated, loginGetController);
router.post('/login', isUnAuthenticated, loginValidator, loginPostController);
router.get('/logout', logoutController);

module.exports = router;
