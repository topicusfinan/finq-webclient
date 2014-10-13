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
    .service('runner', [
        'module',
        'MODULES',
        'EVENTS',
        'story',
        'subscription',
        function (moduleService,MODULES,EVENTS,storyService,subscriptionService) {
        var that = this,
            updateListener = null,
            runningSessions = [];

        this.handle = function(event,eventData) {
            switch (event) {
                case EVENTS.INTERNAL.STORY_RUN_STARTED:
                    handleStoryRunStarted(eventData);
                    break;
                case EVENTS.SOCKET.RUN_STATUS_UPDATED:
                    handleRunUpdate(eventData);
                    break;
                default: break;
            }
        };

        this.getRunningStories = function() {
            return runningSessions;
        };

        var handleRunUpdate = function(runData) {
            for (var i=0; i<runningSessions.length; i++) {
                if (runningSessions[i].run === runData.id) {
                    runningSessions[i].progress = runData.progress;
                    break;
                }
            }
        };

        var handleStoryRunStarted = function(runData) {
            var runProgress = [];
            angular.forEach(runData.stories, function(storyRun) {
                var storyProgress = {
                    storyId: storyRun.story,
                    scenarios: []
                };
                angular.forEach(storyRun.scenarios, function(scenario) {
                    storyProgress.scenarios.push({
                        scenarioId: scenario,
                        currentStep: null,
                        status: undefined,
                        message: undefined
                    });
                });
                runProgress.push(storyProgress);
            });
            runningSessions.push({
                run: runData.reference,
                progress: runProgress,
                startedOn: runData.startedOn,
                environment: runData.environment,
                startedBy: runData.startedBy
            });
            subscriptionService.subscribe(EVENTS.SOCKET.RUN_STATUS_UPDATED,{run: runData.id});
            if (!updateListener) {
                updateListener = subscriptionService.register(EVENTS.SOCKET.RUN_STATUS_UPDATED, that.handle);
            }
        };

    }]);
