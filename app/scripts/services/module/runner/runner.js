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
            runningStories = [];

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
            return runningStories;
        };

        var handleRunUpdate = function(runData) {
            for (var i=0; i<runningStories.length; i++) {
                if (runningStories[i].run === runData.id) {
                    runningStories[i].progress = runData.progress;
                    break;
                }
            }
        };

        var handleStoryRunStarted = function(runData) {
            var progress = [];
            angular.forEach(runData.story.scenarios, function(scenario) {
                progress.push({
                    scenario: scenario,
                    currentStep: null,
                    status: undefined,
                    message: undefined
                });
            });
            runningStories.push({
                run: runData.reference,
                story: runData.story,
                progress: progress,
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
