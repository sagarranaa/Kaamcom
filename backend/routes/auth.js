const express = require('express');
const { register, login } = require('../controllers/authController'); // Make sure this path is correct
const router = express.Router();

// Define routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;
