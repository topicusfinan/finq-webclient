'use strict';
/*global StoryExpandCollapse:false */

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
        '$translate',
        'module',
        'EVENTS',
        'MODULES',
        'STATE',
        'config',
        'runner',
        'environment',
        'utils',
        function ($scope,$timeout,$translate,moduleService,EVENTS,MODULES,STATE,configProvider,runnerService,environmentService,utils) {
        var that = this,
            updateTimer;

        this.selectedItem = null;
        this.maxSelectItems = configProvider.client().pagination.maxSelectDropdownItems;
        this.filter = {
            env: {id: 'env', ids: []}
        };

        $scope.$on(EVENTS.SCOPE.FILTER_SELECT_UPDATED,function(event,filterInfo) {
            that.filter[filterInfo.id].ids = filterInfo.keys;
        });

        $scope.runs = runnerService.getRunningSessions;

        moduleService.setCurrentSection(MODULES.RUNNER.sections.RUNNING);

        this.expander = new StoryExpandCollapse('#run-list');
        this.expander.setup();

        var updateRunProgress = function() {
            var runs = runnerService.getRunningSessions();
            if (runs.length) {
                var currentTime = new Date();
                angular.forEach(runs, function(run) {
                    determineProgress(run);
                    if (run.progress.scenariosCompleted < run.totalScenarios) {
                        run.msg.runtime = utils.getTimeElapsed(currentTime,run.startedOn);
                    }
                    if (run.msg.environment === undefined) {
                        run.msg.environment = run.msg.environment = environmentService.getNameById(run.environment);
                    }
                });
            }
            updateTimer = $timeout(updateRunProgress, configProvider.client().run.updateInterval);
        };

        var determineProgress = function(run) {
            var calculateProgress = function(progressInfo,actionsCompleted,totalActions) {
                progressInfo.percentage = parseInt(actionsCompleted/totalActions*25)*4;
                progressInfo.highlight = progressInfo.failed ? 'failed' : (actionsCompleted === totalActions ? 'success' : 'none');
            };

            calculateProgress(run.progress,run.progress.scenariosCompleted,run.totalScenarios);
            angular.forEach(run.progress.stories,function(story) {
                var i, j, stepsCompleted;
                calculateProgress(story.progress,story.progress.scenariosCompleted,story.scenarios.length);
                for (i=0; i<story.scenarios.length; i++) {
                    stepsCompleted = 0;
                    for (j=0; j<story.scenarios[i].steps.length; j++) {
                        if (story.scenarios[i].steps[j].status === STATE.RUN.SCENARIO.SUCCESS || story.scenarios[i].steps[j].status === STATE.RUN.SCENARIO.FAILED) {
                            stepsCompleted++;
                        }
                        if (story.scenarios[i].steps[j].status === STATE.RUN.SCENARIO.FAILED) {
                            story.scenarios[i].progress.failed = true;
                        }
                    }
                    calculateProgress(story.scenarios[i].progress,stepsCompleted,story.scenarios[i].steps.length);
                }
            });
        };

        updateRunProgress();

        var unlinkDestroy = $scope.$on('$destroy',function() {
            $timeout.cancel(updateTimer);
            unlinkDestroy();
        });

    }]);
