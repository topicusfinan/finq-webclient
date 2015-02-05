'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.service:runUtils
 * @description
 * # Run utilities
 *
 * A service that provides utility functions related to runs.
 */
angular.module('finqApp.runner.service')
    .service('runUtils', ['STATE', '$translate', function (STATE, $translate) {
        var that = this;

        this.determineDetailedProgress = function (run) {
            var updateScenarioDetails = function (scenario) {
                var template, stepsCompleted = 0;
                for (var i = 0; i < scenario.steps.length; i++) {
                    scenario.steps[i].highlight = statusToHighlight(scenario.steps[i].status);
                    if (scenario.steps[i].status === STATE.RUN.SCENARIO.SUCCESS || scenario.steps[i].status === STATE.RUN.SCENARIO.FAILED) {
                        stepsCompleted++;
                    }
                    if (scenario.steps[i].status === STATE.RUN.SCENARIO.FAILED) {
                        scenario.failed = true;
                        scenario.message = scenario.steps[i].message;
                    } else if (scenario.steps[i].status === STATE.RUN.SCENARIO.RUNNING) {
                        scenario.message = scenario.steps[i].title;
                    } else if (i === scenario.steps.length - 1 && scenario.steps[i].status === STATE.RUN.SCENARIO.SUCCESS) {
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
                $translate('RUNNER.RUNNING.RUN.MESSAGE.' + template, {
                    currentStep: stepsCompleted + (STATE.RUN.SCENARIO.RUNNING ? 1 : 0),
                    totalSteps: scenario.steps.length
                }).then(function (translatedValue) {
                    scenario.messagePrefix = translatedValue;
                });
                that.calculateProgress(scenario, stepsCompleted, scenario.steps.length);
            };

            angular.forEach(run.stories, function (story) {
                that.calculateProgress(story, story.scenariosCompleted, story.scenarios.length);
                for (var i = 0; i < story.scenarios.length; i++) {
                    updateScenarioDetails(story.scenarios[i]);
                }
            });
        };

        this.calculateProgress = function (item, actionsCompleted, totalActions) {
            item.percentage = parseInt(actionsCompleted / totalActions * 25, 10) * 4;
            item.highlight = statusToHighlight(item.status);
        };

        var statusToHighlight = function (status) {
            switch (status) {
                case STATE.RUN.SCENARIO.FAILED:
                    return 'failed';
                case STATE.RUN.SCENARIO.SUCCESS:
                    return 'success';
                case STATE.RUN.SCENARIO.SKIPPED:
                    return 'skipped';
                case STATE.RUN.SCENARIO.QUEUED:
                    return 'queued';
                case STATE.RUN.SCENARIO.BLOCKED:
                    return 'blocked';
                default:
                    return 'none';
            }
        };

    }]);
