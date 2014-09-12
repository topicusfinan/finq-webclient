'use strict';

/**
 * @ngdoc overview
 * @name finqApp.controller:AvailableCtrl
 * @description
 * # Available scenarios Controller
 *
 * The available controller allows a user to execute tests. It provides lists of available tests that can
 * be run, and provides the user with the ability to execute a particular test. Such a test can
 * either be run in the background or in debug mode.
 */
angular.module('finqApp.controller')
    .controller('AvailableFilterCtrl', [
        '$scope',
        '$translate',
        'EVENTS',
        'MODULES',
        'set',
        'tag',
        'environment',
        function ($scope,$translate,EVENTS,MODULES,setService,tagService,environmentService) {
        var that = this
            this.setActive = true
            this.tagActive = false;

        var loadFilter = function() {
            var stepsLoaded = 0;
            var totalSteps = 2;

            var evalLoaded = function() {
                stepsLoaded++;
                if (totalSteps === stepsLoaded) {
                    that.loaded = true;
                }
            };

            setService.list().then(function (sets) {
                that.sets = {
                    active: {
                        key: null,
                        value: ''
                    },
                    list: [{key: null, value: ''}].concat(sets)
                };
                evalLoaded();
                $translate('FILTERS.SETS.DEFAULT_VALUE').then(function (translatedValue) {
                    that.sets.active.value = translatedValue;
                    that.sets.list[0].value = translatedValue;
                });
            });

            tagService.list().then(function (tags) {
                that.tags = {
                    active: {
                        key: null,
                        value: ''
                    },
                    list: [{key: null, value: ''}].concat(tags)
                };
                evalLoaded();
                $translate('FILTERS.TAGS.DEFAULT_VALUE').then(function (translatedValue) {
                    that.tags.active.value = translatedValue;
                    that.tags.list[0].value = translatedValue;
                });
            });

            environmentService.list().then(function (environments) {
                that.environments = {
                    active: {
                        key: null,
                        value: ''
                    },
                    list: [{key: null, value: ''}].concat(environments)
                };
                evalLoaded();
                $translate('FILTERS.ENVIRONMENTS.DEFAULT_VALUE').then(function (translatedValue) {
                    that.environments.active.value = translatedValue;
                    that.environments.list[0].value = translatedValue;
                });
            });

        };

        loadFilter();

    }]);
