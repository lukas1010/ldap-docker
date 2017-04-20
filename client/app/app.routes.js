angular.module('ldap-um.routes', [])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        // $httpProvider.interceptors.push('Interceptor');
        $urlRouterProvider
            .otherwise(function ($injector) {
                var $state = $injector.get('$state');
                $state.go('index.userlist');
            })
    })
    .run(function ($rootScope, $state, appConfigs, $localStorage, $sessionStorage,$http , $window, $location) {

        // $http.defaults.headers.common['Authorization'] = 'Bearer' + $window.jwtToken;

        if ($sessionStorage.token) {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $sessionStorage.token; 
            $http.post(appConfigs.baseApiUrl+'/auth/token',{token:$sessionStorage.token}).then(function(res){
                if (!res.data.isVerifiedToken) {
                    $sessionStorage.token = null;
                    $state.go('login');

                } else {
                    console.log(res.data)
                    $rootScope.user = res.data.isVerifiedToken;
                }
            }); 
        } else {
            $state.go('login');
        }  
        

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
           if (toState.name!='login') {
                if (!$sessionStorage.token) {
                    $state.go('login');
                    event.preventDefault();
                    return;
                }
                
           }
        })
    });