'use strict';
/*global StoryExpandCollapse:false */

/**
 * @ngdoc overview
 * @name finqApp.runner.controller:RunningCtrl
 * @description
 * # Running scenarios Controller
 *
 * The available controller allows a user to execute tests. It provides lists of available tests that can
 * be run, and provides the user with the ability to execute a particular test. Such a test can
 * either be run in the background or in debug mode.
 */
angular.module('finqApp.runner.controller')
    .controller('RunningCtrl', function ($scope, $timeout, EVENTS, MODULES, $module, $config, $runner, $utils, $runUtils) {
        var that = this,
            updateTimer;

        this.selectedItem = null;
        this.maxSelectItems = $config.client().selectDropdown.pagination.itemsPerPage;
        this.filter = {
            env: {id: 'env', ids: []}
        };

        $scope.$on(EVENTS.SCOPE.FILTER_SELECT_UPDATED, function (event, filterInfo) {
            that.filter[filterInfo.id].ids = filterInfo.keys;
        });

        $scope.runs = $runner.getRunningSessions;

        $module.setCurrentSection(MODULES.RUNNER.sections.RUNNING);


        this.purge = function () {
            $runner.clearCompletedSessions();
        };

        var updateRunProgress = function () {
            var runs = $runner.getRunningSessions();
            if (runs.length) {
                var currentTime = (new Date()).getTime();
                angular.forEach(runs, function (run) {
                    $runUtils.calculateProgress(run, run.scenariosCompleted, run.totalScenarios);
                    $runUtils.determineDetailedProgress(run);
                    if (run.scenariosCompleted < run.totalScenarios) {
                        run.runtime = $utils.getTimeElapsed(currentTime, run.startedOn);
                    }
                });
            }
            updateTimer = $timeout(updateRunProgress, $config.client().run.updateInterval);
        };

        updateRunProgress();

        var unlinkDestroy = $scope.$on('$destroy', function () {
            $timeout.cancel(updateTimer);
            unlinkDestroy();
        });

    });
