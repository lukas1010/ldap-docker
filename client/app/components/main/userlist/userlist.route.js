angular.module('ldap-um.components.main.userlist')
    .config(UserlistRoute);


function UserlistRoute($stateProvider) {
    $stateProvider
        .state('index.userlist', {
            url: "/userlist",
            templateUrl: 'app/components/main/userlist/userlist.html',
            controller: 'UserListController',
            controllerAs: 'vm',
            ncyBreadcrumb: {
                label: 'SIDEBAR.USERLIST'
            }
        })
}