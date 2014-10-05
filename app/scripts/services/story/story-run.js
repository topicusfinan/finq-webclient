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
        'MODULES',
        'EVENTS',
        'module',
        'environment',
        function (backend,$timeout,feedbackService,FEEDBACK,MODULES,EVENTS,moduleService,environmentService) {
        var that = this;

        this.runStory = function(storyData,environmentKey) {
            run(storyData, environmentKey, function() {
                feedbackService.success(FEEDBACK.SUCCESS.RUN.SINGLE_REQUEST,{
                    environment: environmentService.getValueByKey(environmentKey)
                });
                moduleService.updateModuleBadge(MODULES.RUNNER,1);
                moduleService.updateSectionBadge(MODULES.RUNNER.sections.RUNNING,1);
            }, function() {
                feedbackService.error(FEEDBACK.ERROR.RUN.REQUEST_FAILED);
            });
        };

        this.runStories = function(storyList,environmentKey) {
            if (!storyList.length) {
                feedbackService.alert(FEEDBACK.ALERT.RUN.NO_STORIES_SELECTED);
            } else if (storyList.length === 1) {
                that.runStory(storyList[0], environmentKey);
            } else {
                var completeCount = 0,
                    failCount = 0;
                angular.forEach(storyList, function(story) {
                    run(story, environmentKey, function() {
                        completeCount++;
                        evalFinish();
                    }, function() {
                        failCount++;
                        feedbackService.error(FEEDBACK.ERROR.RUN.REQUEST_FAILED);
                        evalFinish();
                    });
                });
                var evalFinish = function() {
                    if (completeCount+failCount === storyList.length) {
                        if (completeCount > 1) {
                            feedbackService.success(FEEDBACK.SUCCESS.RUN.MULTIPLE_REQUEST,{
                                count: storyList.length,
                                environment: environmentService.getValueByKey(environmentKey)
                            });
                        } else if (completeCount === 1) {
                            feedbackService.success(FEEDBACK.SUCCESS.RUN.SINGLE_REQUEST,{
                                environment: environmentService.getValueByKey(environmentKey)
                            });
                        }
                        moduleService.updateModuleBadge(MODULES.RUNNER,1);
                        moduleService.updateSectionBadge(MODULES.RUNNER.sections.RUNNING,completeCount);
                    }
                };
            }
        };

        var run = function(story,environment,onSuccess,onError) {
            var notice = $timeout(function () {
                feedbackService.notice(FEEDBACK.NOTICE.RUN.REQUEST_IS_TAKING_LONG);
            },5000);
            backend.post('/story/run',{
                story: story,
                environment: environment
            }).success(function(runData) {
                moduleService.handleEvent(EVENTS.INTERNAL.STORY_RUN_STARTED,{
                    reference: runData.id,
                    story: story,
                    environment: runData.environment,
                    startedBy: runData.startedBy,
                    startedOn: runData.startedOn
                });
                onSuccess();
            }).error(function() {
                onError();
            }).finally(function() {
                $timeout.cancel(notice);
            });
        };

    }]);
