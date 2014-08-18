'use strict';

/**
 * @ngdoc overview
 * @name finqApp.runner:AvailableCtrl
 * @description
 * # Available scenarios Controller
 *
 * The available controller allows a user to execute tests. It provides lists of available tests that can
 * be run, and provides the user with the ability to execute a particular test. Such a test can
 * either be run in the background or in debug mode.
 */
angular.module('finqApp')
    .controller('PreloaderCtrl', ['$state','config','translate',function ($state,config,translate) {
    	var defaultLang = 'en';
    	var loaded = {
    		translations: false,
    		config: false
    	};
    	translate.load(defaultLang,function() {
    		loaded.translations = true;
    		console.log('translations loaded for language: '+defaultLang);
    		evalLoaded();
    	});
        config.load(function(){
        	loaded.config = true;
        	console.log('configuration loaded');
        	evalLoaded();
        });
        var evalLoaded = function() {
        	var allLoaded = true;
        	angular.forEach(loaded, function(value) {
        		if (!value) {
        			allLoaded = false;
        		}
        	});
        	if (allLoaded) {
        		$state.go('loaded');
        	}
        };
    }]);
