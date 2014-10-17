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
        '$translate',
        'module',
        'MODULES',
        'EVENTS',
        'story',
        'subscription',
        function ($translate,moduleService,MODULES,EVENTS,storyService,subscriptionService) {
        var that = this,
            updateListener = null,
            runningSessions = [];

        this.handle = function(event,eventData) {
            switch (event) {
                case EVENTS.INTERNAL.STORY_RUN_STARTED:
                    handleRunStarted(eventData);
                    break;
                case EVENTS.SOCKET.RUN_STATUS_UPDATED:
                    handleRunUpdate(eventData);
                    break;
                default: break;
            }
        };

        this.getRunningSessions = function() {
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

        var handleRunStarted = function(runData) {
            var largestStoryScenarioCount = 0;
            var runningSession = {
                run: runData.reference,
                startedOn: runData.startedOn,
                environment: runData.environment,
                startedBy: runData.startedBy,
                scenariosCompleted: 0,
                scenarioCount: 0,
                largestStoryIndex: null,
                progress: []
            };
            for (var i = 0; i<runData.stories.length; i++) {
                runningSession.progress.push(setupStoryForRun(runData.stories[i].story,runData.stories[i].scenarios));
                runningSession.scenarioCount += runData.stories[i].scenarios.length;
                if (runData.stories[i].scenarios.length > largestStoryScenarioCount) {
                    largestStoryScenarioCount = runData.stories[i].scenarios.length;
                    runningSession.largestStoryIndex = i;
                }
            }
            setupRunTitle(runningSession);
            runningSessions.push(runningSession);
            subscriptionService.subscribe(EVENTS.SOCKET.RUN_STATUS_UPDATED,{run: runData.id});
            if (!updateListener) {
                updateListener = subscriptionService.register(EVENTS.SOCKET.RUN_STATUS_UPDATED, that.handle);
            }
        };

        var setupStoryForRun = function(storyId,scenarioIds) {
            var story = angular.copy(storyService.findStoryById(storyId));
            for (var i = 0; i<story.scenarios.length; i++) {
                if (scenarioIds.indexOf(story.scenarios[i].id) === -1) {
                    story.scenarios.splice(i--,1);
                } else {
                    angular.extend(story.scenarios[i],{
                        currentStep: null,
                        status: undefined,
                        message: undefined
                    });
                }
            }
            return story;
        };

        var setupRunTitle = function(runningSession) {
            runningSession.title = runningSession.progress[runningSession.largestStoryIndex].title;
            if (runningSession.progress.length > 1) {
                $translate('RUNNER.RUNNING.RUN.MULTIPLE_STORIES_APPEND',{
                    storyCount: runningSession.progress.length
                }).then(function (translatedValue) {
                    runningSession.title += translatedValue;
                });
            }
        };

    }]);
