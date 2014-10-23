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
        'STATE',
        'story',
        'subscription',
        function ($translate,moduleService,MODULES,EVENTS,STATE,storyService,subscriptionService) {
        var that = this,
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

        var handleRunUpdate = function(runUpdate) {
            for (var i=0; i<runningSessions.length; i++) {
                if (runningSessions[i].id === runUpdate.id) {
                    updateRunProgress(runningSessions[i],runUpdate);
                    break;
                }
            }
        };

        var updateRunProgress = function(targetRun, updatedRunData) {
            var i, story, scenario;
            targetRun.status = updatedRunData.status;
            story = findStoryInRun(targetRun.progress.stories, updatedRunData.story.id);
            story.status = updatedRunData.story.status;
            if (story === null) {
                throw new Error('Server and client story data set are out of sync');
            }
            scenario = findScenarioInStory(story, updatedRunData.story.scenario.id);
            if (scenario === null) {
                throw new Error('Server and client story data set are out of sync');
            }
            scenario.status = updatedRunData.story.scenario.status;
            switch (updatedRunData.story.scenario.status) {
                case STATE.RUN.SCENARIO.SUCCESS:
                    targetRun.progress.scenariosCompleted++;
                    story.progress.scenariosCompleted++;
                    break;
                case STATE.RUN.SCENARIO.FAILED:
                    targetRun.progress.scenariosCompleted++;
                    story.progress.scenariosCompleted++;
                    break;
            }
            for (i=0; i<updatedRunData.story.scenario.steps.length; i++) {
                scenario.steps[i].status = updatedRunData.story.scenario.steps[i].status;
            }
        };

        var findStoryInRun = function(targetRunStories, storyId) {
            for (var i=0; i<targetRunStories.length; i++) {
                if (targetRunStories[i].id === storyId) {
                    return targetRunStories[i];
                }
            }
            return null;
        };

        var findScenarioInStory = function(story, scenarioId) {
            for (var i=0; i<story.scenarios.length; i++) {
                if (story.scenarios[i].id === scenarioId) {
                    return story.scenarios[i];
                }
            }
            return null;
        };

        var handleRunStarted = function(runData) {
            var largestStoryScenarioCount = 0;
            var runningSession = {
                id: runData.id,
                startedOn: runData.startedOn,
                environment: runData.environment,
                startedBy: runData.startedBy,
                totalScenarios: 0,
                largestStoryIndex: 0,
                status: STATE.RUN.SCENARIO.RUNNING,
                progress: {
                    stories: [],
                    scenariosCompleted: 0
                },
                msg: {},
                title: ''
            };
            for (var i = 0; i<runData.stories.length; i++) {
                runningSession.progress.stories.push(setupStoryForRun(runData.stories[i].id,runData.stories[i].scenarios));
                runningSession.totalScenarios += runData.stories[i].scenarios.length;
                if (runData.stories[i].scenarios.length > largestStoryScenarioCount) {
                    largestStoryScenarioCount = runData.stories[i].scenarios.length;
                    runningSession.largestStoryIndex = i;
                }
            }
            setupRunTitle(runningSession);
            runningSessions.push(runningSession);
            subscriptionService.subscribe(EVENTS.SOCKET.RUN_STATUS_UPDATED, that.handle, {run: runData.id});
        };

        var setupStoryForRun = function(storyId,scenarioIds) {
            var story = angular.copy(storyService.findStoryById(storyId));
            var i,j;
            angular.extend(story,{
                status: STATE.RUN.SCENARIO.RUNNING,
                progress: {
                    scenariosCompleted: 0
                }
            });
            for (i = 0; i<story.scenarios.length; i++) {
                if (scenarioIds.indexOf(story.scenarios[i].id) === -1) {
                    story.scenarios.splice(i--,1);
                } else {
                    angular.extend(story.scenarios[i],{
                        status: STATE.RUN.SCENARIO.RUNNING,
                        progress: {
                            stepsCompleted: 0
                        },
                        message: story.scenarios[i].steps[0].title
                    });
                    for (j = 0; j<story.scenarios[i].steps.length; j++) {
                        angular.extend(story.scenarios[i].steps[j],{
                            status: STATE.RUN.SCENARIO.QUEUED
                        });
                    }
                }
            }
            return story;
        };

        var setupRunTitle = function(runningSession) {
            runningSession.title = runningSession.progress.stories[runningSession.largestStoryIndex].title;
            if (runningSession.progress.stories.length > 1) {
                $translate('RUNNER.RUNNING.RUN.MULTIPLE_STORIES_APPEND',{
                    storyCount: runningSession.progress.stories.length-1
                }).then(function (translatedValue) {
                    runningSession.title += translatedValue;
                });
            } else {
                $translate('RUNNER.RUNNING.RUN.SINGLE_STORY_APPEND').then(function (translatedValue) {
                    runningSession.title += translatedValue;
                });
            }
        };

    }]);
