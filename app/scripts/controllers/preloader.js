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
    .controller('PreloaderCtrl', ['$state','$scope','config','EVENTS','translate',function ($state,$scope,config,EVENTS,translate) {
        var that = this;
        this.progress = '0%';
        this.loaded = false;
        this.loadingText = 'Loading...';

        var defaultLang = 'en';
        var loadedText = 'Loaded!';
        var loaded = {
           translations: false,
           config: false
        };
        translate.load(defaultLang,function(data) {
            loaded.translations = true;
            console.log('Translations loaded for language: '+data.LANG);
            loadedText = data.LOADER.LOADED;
            evalLoaded();
        });
        config.load(function(configData){
            loaded.config = true;
            console.log(configData.appTitle+' application configuration loaded');
            $scope.$emit(EVENTS.CONFIG_LOADED);
            evalLoaded();
        });

        var evalLoaded = function() {
            var allLoaded = true;
            var stepsComplete = 0;
            angular.forEach(loaded, function(value) {
                if (!value) {
                    allLoaded = false;
                } else {
                    stepsComplete++;
                }
            });
            updateProgress(stepsComplete);
            if (allLoaded) {
                that.loadingText = loadedText;
                that.loaded = true;
                $state.go('intro.login');
            }
        };

        var updateProgress = function(stepsComplete) {
            that.progress = stepsComplete / Object.keys(loaded).length * 100 + '%';
        };
    }]);
