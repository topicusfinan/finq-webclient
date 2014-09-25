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
        var that = this;

        this.runStory = function(storyData) {
            return that.runStories([storyData]);
        };

        this.runStories = function(storyDataList) {
            if (!storyDataList.length) {
                feedbackService.alert(FEEDBACK.ALERT.RUN.NO_SCENARIOS_SELECTED);
            } else {
                return run(storyDataList);
            }
        };

        var run = function(storyDataList) {
            var notice = $timeout(function () {
                feedbackService.notice(FEEDBACK.NOTICE.RUN.REQUEST_IS_TAKING_LONG);
            },5000);
            backend.post('/story/run',storyDataList).success(function(runData) {
                var scenarios = [];
                angular.forEach(storyDataList,function(storyData) {
                    scenarios = scenarios.concat(storyData.scenarios);
                });
                if (scenarios.length > 1) {
                    feedbackService.success(FEEDBACK.SUCCESS.RUN.MULTIPLE_REQUEST,{
                        count: scenarios.length
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
