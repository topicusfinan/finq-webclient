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
    .service('runExecution', [
        'backend',
        '$timeout',
        'feedback',
        'FEEDBACK',
        'EVENTS',
        'MODULES',
        'module',
        function (backend,$timeout,feedbackService,FEEDBACK,EVENTS,MODULES,moduleService) {
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
                            environment: runData.environment.name
                        });
                    } else {
                        feedbackService.success(FEEDBACK.SUCCESS.RUN.SINGLE_REQUEST,{
                            environment: runData.environment.name
                        });
                    }
                    moduleService.handleEvent(EVENTS.INTERNAL.STORY_RUN_STARTED,{
                        id: runData.id,
                        environment: runData.environment,
                        startedBy: runData.startedBy,
                        startedOn: runData.startedOn,
                        stories: transformRunRequest(runRequestData.stories)
                    });
                    moduleService.updateModuleBadge(MODULES.RUNNER, ['run-'+runData.id], true);
                    moduleService.updateSectionBadge(MODULES.RUNNER.sections.RUNNING, ['run-'+runData.id], true);
                }).error(function(error) {
                    feedbackService.error(FEEDBACK.ERROR.RUN.REQUEST_FAILED);
                    console.debug(error);
                }).finally(function() {
                    $timeout.cancel(notice);
                });
            };

            var transformRunRequest = function(stories) {
                angular.forEach(stories, function(story) {
                    for (var i=0; i<story.scenarios.length; i++) {
                        story.scenarios[i] = {
                            id: story.scenarios[i]
                        };
                    }
                });
                return stories;
            };

        }]);
