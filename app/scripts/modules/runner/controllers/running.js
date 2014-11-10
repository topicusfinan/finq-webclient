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
angular.module('finqApp.runner.controller')
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
        this.maxSelectItems = configProvider.client().selectDropdown.pagination.itemsPerPage;
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
                    if (run.scenariosCompleted < run.totalScenarios) {
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
            var calculateProgress = function(item,actionsCompleted,totalActions) {
                item.percentage = parseInt(actionsCompleted/totalActions*25, 10)*4;
                switch (item.status) {
                    case STATE.RUN.SCENARIO.FAILED:
                        item.highlight = 'failed';
                        break;
                    case STATE.RUN.SCENARIO.SUCCESS:
                        item.highlight = 'success';
                        break;
                    default:
                        item.highlight = 'none';
                        break;
                }
            };

            var updateScenarioDetails = function(scenario) {
                var template, stepsCompleted = 0;
                for (var i=0; i<scenario.steps.length; i++) {
                    if (scenario.steps[i].status === STATE.RUN.SCENARIO.SUCCESS || scenario.steps[i].status === STATE.RUN.SCENARIO.FAILED) {
                        stepsCompleted++;
                    }
                    if (scenario.steps[i].status === STATE.RUN.SCENARIO.FAILED) {
                        scenario.failed = true;
                        scenario.message = scenario.steps[i].message;
                    } else if (scenario.steps[i].status === STATE.RUN.SCENARIO.RUNNING) {
                        scenario.message = scenario.steps[i].title;
                    } else if (i === scenario.steps.length-1 && scenario.steps[i].status === STATE.RUN.SCENARIO.SUCCESS) {
                        scenario.message = '';
                    }
                }
                switch (scenario.status) {
                    case STATE.RUN.SCENARIO.FAILED:
                        template = 'FAILED_PREPEND';
                        break;
                    case STATE.RUN.SCENARIO.SUCCESS:
                        template = 'SUCCESS_PREPEND';
                        break;
                    default:
                        template = 'RUNNING_PREPEND';
                        break;
                }
                $translate('RUNNER.RUNNING.RUN.MESSAGE.'+template,{
                    currentStep: stepsCompleted + (STATE.RUN.SCENARIO.RUNNING ? 1 : 0),
                    totalSteps: scenario.steps.length
                }).then(function(translatedValue) {
                    scenario.messagePrefix = translatedValue;
                });
                calculateProgress(scenario,stepsCompleted,scenario.steps.length);
            };

            calculateProgress(run,run.scenariosCompleted,run.totalScenarios);
            angular.forEach(run.stories,function(story) {
                calculateProgress(story,story.scenariosCompleted,story.scenarios.length);
                for (var i=0; i<story.scenarios.length; i++) {
                    updateScenarioDetails(story.scenarios[i]);
                }
            });
        };

        updateRunProgress();

        var unlinkDestroy = $scope.$on('$destroy',function() {
            $timeout.cancel(updateTimer);
            unlinkDestroy();
        });

    }]);
