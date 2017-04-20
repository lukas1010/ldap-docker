"use strict";

angular.module('ldap-um', [
    'ui.router',
    'ngStorage',
    'ui.bootstrap',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'ngFileUpload',
    'ncy-angular-breadcrumb',
    'dynamicNumber',

    'ldap-um.config',
    'ldap-um.routes',

    'ldap-um.translate',
    'ldap-um.services',
    'ldap-um.appDirectives',
    'ldap-um.themeDirectives',
    'ldap-um.filters',
    'ldap-um.components'
]);