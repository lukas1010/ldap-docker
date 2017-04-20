var router = require('express').Router();
var authController = require('./../controllers/auth.controller');

module.exports = function () {  


  router.post('/login', authController.login);  
  router.post('/token', authController.verifyToken) 	

  return router;
};
