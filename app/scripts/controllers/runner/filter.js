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
angular.module('finqApp.runner')
    .controller('AvailableFilterCtrl', [
        '$scope',
        '$translate',
        'EVENTS',
        'MODULES',
        'set',
        'tag',
        function ($scope,$translate,EVENTS,MODULES,setService,tagService) {
        $scope.filterLoaded = false;

        var loadFilter = function() {
            var stepsLoaded = 0;
            var totalSteps = 2;

            var evalLoaded = function() {
                stepsLoaded++;
                if (totalSteps == stepsLoaded) {
                    $scope.filterLoaded = true;
                }
            };

            setService.list(function (sets) {
                $translate('FILTERS.SETS.DEFAULT_VALUE').then(function (translatedValue) {
                    $scope.sets = {
                        active: {
                            key: null,
                            value: translatedValue
                        },
                        list: [{key: null, value: translatedValue}].concat(sets)
                    };
                    evalLoaded();
                });
            });

            tagService.list(function (tags) {
                $translate('FILTERS.TAGS.DEFAULT_VALUE').then(function (translatedValue) {
                    $scope.tags = {
                        active: {
                            key: null,
                            value: translatedValue
                        },
                        list: [{key: null, value: translatedValue}].concat(tags)
                    };
                    evalLoaded();
                });
            });

        };

        loadFilter();

    }]);
