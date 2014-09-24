'use strict';

/**
 * @ngdoc function
 * @name finqApp.service.story:storyRun
 * @description
 * # Story run service
 *
 * Execute a scenario or a collection of scenarios.
 *
 */
angular.module('finqApp.service')
    .service('storyRun', [
        'backend',
        '$timeout',
        'feedback',
        'FEEDBACK',
        'EVENTS',
        'module',
        function (backend,$timeout,feedbackService,FEEDBACK,EVENTS,moduleService) {
        var that = this,
            runningScenarios = [];

        this.runScenario = function(scenarioId) {
            return that.runScenarios([scenarioId]);
        };

        this.runScenarios = function(scenarioIds) {
            if (!scenarioIds.length) {
                feedbackService.alert(FEEDBACK.ALERT.RUN.NO_SCENARIOS_SELECTED);
            } else {
                return run({scenarios: scenarioIds});
            }
        };

        var run = function(data) {
            var notice = $timeout(function () {
                feedbackService.notice(FEEDBACK.NOTICE.RUN.REQUEST_IS_TAKING_LONG);
            },5000);
            backend.get('/story/run',data).success(function(runData) {
                runningScenarios.push(runData);
                if (data.scenarios.length > 1) {
                    feedbackService.success(FEEDBACK.SUCCESS.RUN.MULTIPLE_REQUEST,{
                        count: data.scenarios.length
                    });
                } else {
                    feedbackService.success(FEEDBACK.SUCCESS.RUN.SINGLE_REQUEST);
                }
                moduleService.handleEvent(EVENTS.INTERNAL.SCENARIO_RUN_STARTED,{
                    reference: runData.id,
                    scenarios: data.scenarios
                });
            }).error(function(error) {
                feedbackService.error(FEEDBACK.ERROR.RUN.REQUEST_FAILED);
                console.debug(error);
            }).finally(function() {
                $timeout.cancel(notice);
            });
        };

    }]);
