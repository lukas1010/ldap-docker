angular
	.module('ldap-um.components.auth.login')
	.factory('LoginServices', Service);

	function Service($http, appConfigs) {
		var service = {}

		service.auth = auth;

		function auth (user,cb) {
			$http.post(appConfigs.baseApiUrl+'/auth/login',user).then(function(res){
				cb(null,res.data);
			},function(err){
				cb(err);
			})
		}

		return service;
	};