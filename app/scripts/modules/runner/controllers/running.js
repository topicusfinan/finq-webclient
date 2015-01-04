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
    .controller('RunningCtrl', [
        '$scope',
        '$timeout',
        'module',
        'EVENTS',
        'MODULES',
        'config',
        'runner',
        'utils',
        'runUtils',
        function ($scope, $timeout, moduleService, EVENTS, MODULES, configProvider, runnerService, utils, runUtils) {
            var that = this,
                updateTimer;

            this.selectedItem = null;
            this.maxSelectItems = configProvider.client().selectDropdown.pagination.itemsPerPage;
            this.filter = {
                env: {id: 'env', ids: []}
            };

            $scope.$on(EVENTS.SCOPE.FILTER_SELECT_UPDATED, function (event, filterInfo) {
                that.filter[filterInfo.id].ids = filterInfo.keys;
            });

            $scope.runs = runnerService.getRunningSessions;

            moduleService.setCurrentSection(MODULES.RUNNER.sections.RUNNING);

            this.expander = new StoryExpandCollapse('#run-list');
            this.expander.setup();

            this.purge = function() {
                runnerService.clearCompletedSessions();
            };

            var updateRunProgress = function () {
                var runs = runnerService.getRunningSessions();
                if (runs.length) {
                    var currentTime = new Date();
                    angular.forEach(runs, function (run) {
                        runUtils.calculateProgress(run, run.scenariosCompleted, run.totalScenarios);
                        runUtils.determineDetailedProgress(run);
                        if (run.scenariosCompleted < run.totalScenarios) {
                            run.runtime = utils.getTimeElapsed(currentTime, run.startedOn);
                        }
                    });
                }
                updateTimer = $timeout(updateRunProgress, configProvider.client().run.updateInterval);
            };

            updateRunProgress();

            var unlinkDestroy = $scope.$on('$destroy', function () {
                $timeout.cancel(updateTimer);
                unlinkDestroy();
            });

        }]);
