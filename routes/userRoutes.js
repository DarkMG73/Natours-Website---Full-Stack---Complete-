const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/login', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Since middleware runs in sequence, this can be used here to protect all router objects after this point.
router.use(authController.protect);

router.patch('/updateMyPassword/', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);

// upload.single() is Multer's way of allowing only one photo to be uploaded.
router.patch(
  '/updateMe/',
  userController.uploadUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe/', userController.deleteMe);

router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route('/:id').delete(userController.deleteUser);
module.exports = router;
