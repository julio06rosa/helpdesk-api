const express = require('express');

const {
  login,
} = require('../controllers/authController');

const validateBody = require('../middlewares/validateBody');

const {
  loginSchema,
} = require('../validators/authSchemas');

const router = express.Router();

router.post(
  '/login',
  validateBody(loginSchema),
  login
);

module.exports = router;