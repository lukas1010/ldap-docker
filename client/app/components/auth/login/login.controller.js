angular.module('ldap-um.components.auth.login')
    .controller('LoginController', LoginController);

LoginController.$inject = ['$state', '$localStorage', '$sessionStorage','LoginServices','$http','$rootScope'];
function LoginController($state, $localStorage, $sessionStorage, LoginServices, $http, $rootScope) {

    var vm = this;
    vm.isShowError = false;
    vm.submit = function() {
    	LoginServices.auth(vm.user,function(err,data){
            if (err) {
                console.log(err);
            } else {
                if (data.token) {
                    console.log(data.token);
                    $sessionStorage.token = data.token;
                    $rootScope.user = data;
                    $http.defaults.headers.common['Authorization'] = 'Bearer ' + $sessionStorage.token; 
                    vm.isShowError = false;
                    $state.go('index.userlist');
                } else {
                    vm.isShowError = true;
                }
                
            }
    		
    	});
    }
}
