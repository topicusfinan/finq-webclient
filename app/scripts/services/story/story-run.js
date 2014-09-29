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
        'environment',
        function (backend,$timeout,feedbackService,FEEDBACK,EVENTS,moduleService,environmentService) {
        var that = this;

        this.runStory = function(storyData,environmentKey) {
            return that.runStories([storyData],environmentKey);
        };

        this.runStories = function(storyDataList,environmentKey) {
            if (!storyDataList.length) {
                feedbackService.alert(FEEDBACK.ALERT.RUN.NO_SCENARIOS_SELECTED);
            } else {
                return run({
                    stories: storyDataList,
                    environment: environmentKey
                });
            }
        };

        var run = function(runRequestData) {
            var notice = $timeout(function () {
                feedbackService.notice(FEEDBACK.NOTICE.RUN.REQUEST_IS_TAKING_LONG);
            },5000);
            backend.post('/story/run',runRequestData).success(function(runData) {
                var scenarios = [];
                angular.forEach(runRequestData.stories,function(storyData) {
                    scenarios = scenarios.concat(storyData.scenarios);
                });
                if (scenarios.length > 1) {
                    feedbackService.success(FEEDBACK.SUCCESS.RUN.MULTIPLE_REQUEST,{
                        count: scenarios.length,
                        environment: environmentService.getValueByKey(runRequestData.environment)
                    });
                } else {
                    feedbackService.success(FEEDBACK.SUCCESS.RUN.SINGLE_REQUEST);
                }
                moduleService.handleEvent(EVENTS.INTERNAL.SCENARIO_RUN_STARTED,{
                    reference: runData.id,
                    scenarios: scenarios
                });
            }).error(function(error) {
                feedbackService.error(FEEDBACK.ERROR.RUN.REQUEST_FAILED);
                console.debug(error);
            }).finally(function() {
                $timeout.cancel(notice);
            });
        };

    }]);
