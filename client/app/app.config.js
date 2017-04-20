angular.module('ldap-um.config', [])
    .constant('appConfigs', {
        baseApiUrl: 'http://localhost:3000/api/v1',
        baseUrl: 'http://localhost:4000'
        // baseApiUrl: 'http://h2-inc.com:3000/api/v1',
        // baseUrl: 'http://h2-inc.com:4000'
    });