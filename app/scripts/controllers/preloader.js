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
angular.module('finqApp.controller')
    .controller('PreloaderCtrl', [
        '$state',
        '$scope',
        'config',
        'EVENTS',
        'translate',
        'authenticate',
        'environment',
        function ($state,$scope,configProvider,EVENTS,translateService,authenticateService,environmentService) {
        var that = this;
        this.progress = '0%';
        this.loaded = false;
        this.authenticated = false;
        this.loadingText = 'Loading...';
        this.loadError = '';
        this.loadNotice = '';

        var defaultLang = 'en';
        var loadedText = 'Loaded!';
        var loaded = {
           translations: false,
           config: false,
           user: false,
           environments: false
        };

        translateService.load(defaultLang).then(function(data) {
            loaded.translations = true;
            console.debug('Translations loaded for language: '+data.LANG);
            loadedText = data.LOADER.LOADED;
            evalLoaded();
        },function(error) {
            that.loadError = error;
        },function(notice) {
            that.loadNotice = notice;
        });

        configProvider.load().then(function(serverConfigData) {
            loaded.config = true;
            console.debug(serverConfigData.title+' application configuration loaded');
            $scope.$emit(EVENTS.CONFIG_LOADED,serverConfigData);
            loadEnvironments();
            tryAuthentication();
        },function(error) {
            that.loadError = error;
        },function(notice) {
            that.loadNotice = notice;
        });

        var tryAuthentication = function() {
            authenticateService.load().then(function(user) {
                that.authenticated = true;
                console.debug('Authentication completed: user '+user.name+' authenticated successfully');
            }, function() {
                that.authenticated = false;
                console.debug('Automatic authentication failed: no user found, login required');
            }).finally(function() {
                loaded.user = true;
                evalLoaded();
            });
        };

        var loadEnvironments = function() {
            environmentService.load().then(function(environments) {
                loaded.environments = true;
                console.debug('Loaded '+environments.length+' environments for story execution');
            },function(error) {
                that.loadError = error;
            },function(notice) {
                that.loadNotice = notice;
            });
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
