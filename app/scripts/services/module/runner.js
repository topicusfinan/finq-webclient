'use strict';

/**
 * @ngdoc function
 * @name finqApp.service.module:runner
 * @description
 * # Runner module service
 *
 * A service dedicated to the runner module, allowing this module to respond to related
 * events, and provide information on the runner module to other services and controllers.
 */
angular.module('finqApp.service')
    .service('runner', ['module','MODULES','EVENTS','story','subscription',function (moduleService,MODULES,EVENTS,storyService,subscriptionService) {
        var that = this,
            updateListener = null,
            runningStories = {};

        this.handle = function(event,eventData) {
            switch (event) {
                case EVENTS.INTERNAL.STORY_RUN_STARTED:
                    handleScenarioRunStarted(eventData);
                    break;
                case EVENTS.SOCKET.RUN_STATUS_UPDATED:
                    handleRunUpdate(eventData);
                    break;
                default: break;
            }
        };

        this.getRunningStories = function() {
            return [];
            // TODO: implement
        };

        var handleRunUpdate = function(runData) {
            if (runningStories[runData.id]) {
                runningStories[runData.id].progress = runData.progress;
            }
        };

        var handleScenarioRunStarted = function(runData) {
            moduleService.updateModuleBadge(MODULES.RUNNER,1);
            moduleService.updateSectionBadge(MODULES.RUNNER.sections.RUNNING,runData.stories.length);
            angular.forEach(runData.stories,function(storyRun) {
                var progress = [];
                angular.forEach(storyRun.scenarios, function(scenario) {
                    progress.push({
                        scenario: scenario,
                        currentStep: null,
                        status: undefined,
                        message: undefined
                    });
                });
                runningStories[runData.id] = {
                    story: storyRun.story,
                    progress: progress
                };
            });
            subscriptionService.subscribe(EVENTS.SOCKET.RUN_STATUS_UPDATED,{run: runData.id});
            if (!updateListener) {
                updateListener = subscriptionService.register(EVENTS.SOCKET.RUN_STATUS_UPDATED, that.handle);
            }
        };

    }]);
