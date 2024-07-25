// routes/users.js
const express = require('express');
const router = express.Router();
const { User } = require('../models/index'); // Ensure correct import
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');




module.exports = router;