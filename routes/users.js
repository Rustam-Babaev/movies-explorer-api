const router = require('express').Router();
const {
  getOwner,
  changeProfile,
  signOut,
} = require('../controllers/users');
const { usersValidator } = require('../validation/users-valitation');

router.get('/me', getOwner);

router.patch('/me', usersValidator, changeProfile);

router.post('/me/signout', signOut);

module.exports = router;
