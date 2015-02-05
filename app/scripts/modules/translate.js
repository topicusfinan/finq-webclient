'use strict';

/**
 * Created by c.kramer on 8/18/2014.
 */
angular.module('finqApp.translate', ['pascalprecht.translate'])
    .config(function ($translateProvider) {
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLoader('customLoader');
    }).factory('customLoader', ['translate', function (translate) {
        // return loaderFn
        return function () {
            return translate.getTranslations();
        };
    }]);
