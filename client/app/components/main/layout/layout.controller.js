angular.module('ldap-um.components.main.layout')
    .controller('LayoutController', LayoutController);


function LayoutController($rootScope, $state, $localStorage, $sessionStorage, $translate) {
    var vm = this;

    vm.logOut = logOut;
    vm.myInfor = $rootScope.user;
    vm.languages = [{text: 'English', id: 'en'},{text: 'Francais', id: 'fr'}];
    vm.currentLanguage = 'English';
    vm.changeLanguage = changeLanguage;

    function changeLanguage(index) {
    	$translate.use(vm.languages[index].id);
    	vm.currentLanguage = vm.languages[index].text;
    }

    function logOut() {
        delete $localStorage.token;
        delete $sessionStorage.token;
        $state.go('login');
    }
}
