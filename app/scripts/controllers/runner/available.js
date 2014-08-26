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
    .controller('AvailableCtrl', ['$scope','$translate','EVENTS','MODULES','$http','set',function ($scope,$translate,EVENTS,MODULES,$http,setService) {
        $scope.filterLoaded = false;

        // emit the controller updated event immediately after loading to update the page information
        $scope.$emit(EVENTS.PAGE_CONTROLLER_UPDATED,{
            module: MODULES.RUNNER,
            // our default section is the list with available scenarios that can be run
            section: MODULES.RUNNER.sections.AVAILABLE
        });

        var loadFilter = function() {
            var stepsLoaded = 0;
            var totalSteps = 1;

            var evalLoaded = function() {
                stepsLoaded++;
                if (totalSteps == stepsLoaded) {
                    $scope.filterLoaded = true;
                }
            };

            setService.list(function (sets) {
                $translate('FILTERS.SETS.DEFAULT_NAME_TITLE').then(function (translatedValue) {
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

        };

        loadFilter();

        /*var loadStories = function() {

        };*/
    }]);
