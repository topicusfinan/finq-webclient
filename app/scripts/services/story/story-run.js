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
        'MODULES',
        'module',
        'environment',
        function (backend,$timeout,feedbackService,FEEDBACK,EVENTS,MODULES,moduleService,environmentService) {
        var that = this;

        this.runStory = function(storyData,environmentKey) {
            return that.runStories([storyData],environmentKey);
        };

        this.runStories = function(storyDataList,environmentKey) {
            if (!storyDataList.length) {
                feedbackService.alert(FEEDBACK.ALERT.RUN.NO_STORIES_SELECTED);
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
            backend.post('/run/stories',runRequestData).success(function(runData) {
                if (runRequestData.stories.length > 1) {
                    feedbackService.success(FEEDBACK.SUCCESS.RUN.MULTIPLE_REQUEST,{
                        count: runRequestData.stories.length,
                        environment: environmentService.getNameById(runRequestData.environment)
                    });
                } else {
                    feedbackService.success(FEEDBACK.SUCCESS.RUN.SINGLE_REQUEST,{
                        environment: null
                    });
                }
                moduleService.handleEvent(EVENTS.INTERNAL.STORY_RUN_STARTED,{
                    reference: runData.id,
                    environment: runData.environment,
                    startedBy: runData.startedBy,
                    startedOn: runData.startedOn,
                    stories: runRequestData.stories
                });
                moduleService.updateModuleBadge(MODULES.RUNNER,1);
                moduleService.updateSectionBadge(MODULES.RUNNER.sections.RUNNING,1);
            }).error(function(error) {
                feedbackService.error(FEEDBACK.ERROR.RUN.REQUEST_FAILED);
                console.debug(error);
            }).finally(function() {
                $timeout.cancel(notice);
            });
        };

    }]);
