const express = require('express');
const router = express.Router();

const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

router.get('/', userController.home);

module.exports = router;
