const express = require('express');
const { createChatCompletion } = require('../controllers/openaiController');

const router = express.Router();

router.post('/', createChatCompletion);

module.exports = router