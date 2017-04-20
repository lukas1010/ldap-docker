angular
	.module('ldap-um.components.main.userlist')
	.factory('UserlistService', Service);

	function Service($http, appConfigs) {
		var service = {}

		service.listFields = [
			{
				type: 'string',
				text: 'USER_ID',
				bindField: 'uid',
			},
			{
				type: 'string',
				text: 'NAME',
				bindField: 'cn',
			},
			{
				type: 'string',
				text: 'LAST_NAME',
				bindField: 'sn',
			},
			{
				type: 'checkbox',
				text: 'Gmao',
				bindField: 'gmao',
			},
			{
				type: 'checkbox',
				text: 'Adimot',
				bindField: 'adimot',
			},
			{
				type: 'checkbox',
				text: 'Mobility',
				bindField: 'mobility',
			},
			{
				type: 'checkbox',
				text: 'User Management',
				bindField: 'userManagement',
			},
				
		];

		service.passwordLength = 6;

		service.numberRange = {min: 0, max:4};

		service.getUsers = function(params,cb) {
			$http.post(appConfigs.baseApiUrl+'/user/getusers',params).then(function(res){
				cb(null,res.data);
			},function(err){
				cb(err);
			})
		}

		service.updateUser = function(user, cb) {
			$http.post(appConfigs.baseApiUrl+'/user/updateuser',user).then(function(res){
				cb(null, res.data);
			}, function(err) {
				cb(err);
			})
		}

		service.deleteUser = function(uid, cb) {
			$http.post(appConfigs.baseApiUrl+'/user/deleteuser',{uid:uid}).then(function(res){
				cb(null, res.message);
			}, function(err) {
				cb(err);
			})
		}

		service.addNewUser = function(user, cb) {
			$http.post(appConfigs.baseApiUrl+'/user/adduser',user).then(function(res){
				cb(null, res);
			}, function(err) {
				cb(err);
			})
		}

		return service;
	};