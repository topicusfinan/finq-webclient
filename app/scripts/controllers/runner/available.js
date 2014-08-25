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
    .controller('AvailableCtrl', ['$scope','EVENTS','MODULES','$http',function ($scope,EVENTS,MODULES,$http) {
        // emit the controller updated event immediately after loading to update the page information
        $scope.$emit(EVENTS.PAGE_CONTROLLER_UPDATED,{
            module: MODULES.RUNNER,
            // our default section is the list with available scenarios that can be run
            section: MODULES.RUNNER.sections.AVAILABLE
        });

        $scope.sets = {
            active: {
                key: 0,
                value: 'All stories'
            },
            list: [
                {
                    key: 0,
                    value: 'All stories'
                },
                {
                    key: 1,
                    value: 'Nightly'
                },
                {
                    key: 2,
                    value: 'Regression'
                }
            ]
        };

        $http.get('/story/books').success(function(data) {
            // initial load of the storybooks
            // TODO create lists with stories and scenarios
        });
    }]);
