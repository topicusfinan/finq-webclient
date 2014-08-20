'use strict';

/**
 * @ngdoc overview
 * @name finqApp:PreloaderCtrl
 * @description
 * # Application preloader
 *
 * Explicitly preload certain content before the actual application is initialized. This ensures
 * that required files and data has been initialized properly if that data had to be retrieved
 * asynchronously.
 *
 * Application state will be changed to 'loaded' after all content has been successfully preloaded.
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
