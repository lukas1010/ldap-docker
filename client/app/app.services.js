angular
        .module('ldap-um')
        .factory('NotificationService', Service);

    function Service($rootScope, $timeout) {
        var service = {};

        service.success = Success;
        service.error = Error;

        initService();

        return service;

        function initService() {
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });

            function clearFlashMessage() {
                var flash = $rootScope.flash;
                if (flash) {
                    if (!flash.keepAfterLocationChange) {
                        delete $rootScope.flash;
                    } else {
                        // only keep for a single location change
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }

        function Success(message, keepAfterLocationChange) {
            $rootScope.notification = {
                message: message,
                type: 'success', 
                keepAfterLocationChange: keepAfterLocationChange
            };

            clearNo();




        }

        function Error(message, keepAfterLocationChange) {
            $(window).scrollTop(0);
            $rootScope.notification = {
                message: message,
                type: 'danger',
                keepAfterLocationChange: keepAfterLocationChange
            };

            clearNo();
        }

        function clearNo () {
            $timeout(function(){
                $rootScope.notification = null;
            },5000)
        }
    }