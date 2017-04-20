var router = require('express').Router();
var userController = require('./../controllers/user.controller');

module.exports = function () {  


  router.post('/getusers', userController.getUsers); 
  router.post('/updateuser', userController.updateUser);
  router.post('/deleteuser', userController.deleteUser);
  router.post('/adduser', userController.addUser);

  return router;
};
