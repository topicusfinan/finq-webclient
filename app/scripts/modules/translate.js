'use strict';

/**
 * Created by c.kramer on 8/18/2014.
 */
angular.module('finqApp.translations', ['pascalprecht.translate'])
    .config(function($translateProvider) {
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '/lang/{part}/{lang}.json'
        });
        /*$translateProvider.useStaticFilesLoader({
            prefix: '/lang/',
            suffix: '.json'
        });*/
        //$translateProvider.useLocalStorage();
    });