'use strict';

/**
 * @ngdoc overview
 * @name finqApp.controller:RunningCtrl
 * @description
 * # Running scenarios Controller
 *
 * The available controller allows a user to execute tests. It provides lists of available tests that can
 * be run, and provides the user with the ability to execute a particular test. Such a test can
 * either be run in the background or in debug mode.
 */
angular.module('finqApp.controller')
    .controller('RunningCtrl', [
        '$scope',
        '$timeout',
        'module',
        'EVENTS',
        'MODULES',
        'config',
        'runner',
        function ($scope,$timeout,moduleService,EVENTS,MODULES,configProvider,runnerService) {
        var that = this;

        this.selectedItem = null;
        this.maxSelectItems = configProvider.client().pagination.maxSelectDropdownItems;
        this.filter = {
            env: {id: 'env', keys: []}
        };

        $scope.$on(EVENTS.SCOPE.FILTER_SELECT_UPDATED,function(event,filterInfo) {
            that.filter[filterInfo.id].keys = filterInfo.keys;
        });

        $scope.runs = runnerService.getRunningStories;

        moduleService.setCurrentSection(MODULES.RUNNER.sections.RUNNING);

    }]);
