const router = require('express').Router();

const emailController = require('../controllers/email.controller');
router.get('/email/send', emailController.sendEmail);


module.exports = router;