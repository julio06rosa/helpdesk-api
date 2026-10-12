const express = require('express');

const {
  createUser,
} = require('../controllers/userController');

const validateBody = require('../middlewares/validateBody');
const {
  registerSchema,
} = require('../validators/authSchemas');

const router = express.Router();

router.post(
  '/',
  validateBody(registerSchema),
  createUser
);

module.exports = router;