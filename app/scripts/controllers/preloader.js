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
    .controller('PreloaderCtrl', [
        '$state',
        '$scope',
        'config',
        'EVENTS',
        'translate',
        'authenticate',
        function ($state,$scope,configProvider,EVENTS,translateService,authenticateService) {
        var that = this;
        this.progress = '0%';
        this.loaded = false;
        this.authenticated = false;
        this.loadingText = 'Loading...';

        var defaultLang = 'en';
        var loadedText = 'Loaded!';
        var loaded = {
           translations: false,
           config: false,
           user: false
        };

        translateService.load(defaultLang,function(data) {
            loaded.translations = true;
            console.debug('Translations loaded for language: '+data.LANG);
            loadedText = data.LOADER.LOADED;
            evalLoaded();
        });
        configProvider.load(function(configData){
            loaded.config = true;
            console.debug(configData.appTitle+' application configuration loaded');
            $scope.$emit(EVENTS.CONFIG_LOADED);
            authenticateService.load(authenticationSuccess,authenticationFailed);
        });

        var authenticationFailed = function() {
            that.authenticated = false;
            loaded.user = true;
            console.debug('Automatic authentication failed: no user found, login required');
            evalLoaded();
        };
        var authenticationSuccess = function(user) {
            loaded.user = true;
            that.authenticated = true;
            console.debug('Authentication completed: user '+user.name+' authenticated successfully');
            evalLoaded();
        };

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
            that.progress = stepsComplete / Object.keys(loaded).length * 100 + '%';
            if (allLoaded) {
                loadComplete();
            }
        };

        var loadComplete = function() {
            that.loadingText = loadedText;
            that.loaded = true;
            if (that.authenticated) {
                $state.go('authenticated');
            } else {
                $state.go('intro.login');
            }
        };
    }]);
