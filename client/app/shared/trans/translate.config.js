angular.module('ldap-um.translate',[])
    .config(TranslateConfig);

function TranslateConfig($translateProvider) {
    //translate
    $translateProvider.useStaticFilesLoader({
        prefix: 'app/shared/trans/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
}