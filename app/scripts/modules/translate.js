'use strict';

/**
 * Created by c.kramer on 8/18/2014.
 */
angular.module('finqApp.translate', ['pascalprecht.translate'])
    .config(function($translateProvider) {
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLoader('customLoader');
    }).factory('customLoader', function ($translation) {
	    // return loaderFn
	    return function () {
	        return $translation.getTranslations();
	    };
	});
