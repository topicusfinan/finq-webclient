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
    .controller('AvailableCtrl', ['$scope','EVENTS','MODULES','FILTER_SELECT_EVENTS',function ($scope,EVENTS,MODULES,FILTER_SELECT_EVENTS) {
        $scope.filterLoaded = false;
        $scope.tagFilter = 'tags';
        $scope.setFilter = 'sets';

        // emit the controller updated event immediately after loading to update the page information
        $scope.$emit(EVENTS.PAGE_CONTROLLER_UPDATED,{
            module: MODULES.RUNNER,
            // our default section is the list with available scenarios that can be run
            section: MODULES.RUNNER.sections.AVAILABLE
        });

        $scope.$on(FILTER_SELECT_EVENTS.UPDATED,function(event,filterInfo) {
            console.log('Filter "'+filterInfo.id+'" updated to key "'+filterInfo.key+'"');
            // TODO: handle the event by updating the internal list filter for test sets
        });

    }]);
