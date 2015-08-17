'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.service:runner
 * @description
 * # Runner module service
 *
 * A service dedicated to the runner module, allowing this module to respond to related
 * events, and provide information on the runner module to other services and controllers.
 */
angular.module('finqApp.runner.service')
    .service('$runner', function ($module, MODULES, EVENTS, STATE, FEEDBACK, $story, $feedback, $subscription, $reporterFilter, $run, $report, $utils, $timeout) {
        var runningSessions = [],
            loaded = false;

        this.initialize = function () {
            $subscription.register(EVENTS.SOCKET.RUN.UPDATED, this.handle);
            $subscription.register(EVENTS.SOCKET.RUN.GIST, this.handle);
            $subscription.register(EVENTS.SOCKET.RUN.COMPLETED, this.handle);
        };

        this.handle = function (event, eventData) {
            switch (event) {
                case EVENTS.INTERNAL.STORY_RUN_STARTED:
                    handleRunStarted(eventData);
                    break;
                case EVENTS.SOCKET.RUN.GIST:
                    handleRunGist(eventData);
                    break;
                case EVENTS.SOCKET.RUN.UPDATED:
                    handleRunUpdate(eventData);
                    break;
                case EVENTS.SOCKET.RUN.COMPLETED:
                    handleNewReport(eventData);
                    break;
                default:
                    break;
            }
        };

        this.getRunningSessions = function () {
            if (!loaded) {
                $story.list().then(function () {
                    $run.list().then(initializeRunningStories);
                });
                loaded = true;
            }
            return runningSessions;
        };

        this.clearCompletedSessions = function () {
            if (loaded) {
                for (var i = 0; i < runningSessions.length; i++) {
                    if ($run.runIsCompleted(runningSessions[i])) {
                        runningSessions.splice(i--, 1);
                    }
                }
            }
        };

        var initializeRunningStories = function (storyRuns) {
            angular.forEach(storyRuns, function (run) {
                if (findRun(run.id) === null) {
                    handleRunStarted(run);
                    handleRunGist(run);
                }
            });
        };

        var handleRunStarted = function (runData) {
            var runningSession = {
                id: runData.id,
                startedOn: runData.startedOn,
                environment: runData.environment,
                startedBy: runData.startedBy,
                totalScenarios: 0,
                scenariosCompleted: 0,
                scenariosFailed: 0,
                status: STATE.RUN.SCENARIO.RUNNING,
                stories: [],
                msg: {},
                title: ''
            };

            for (var i = 0; i < runData.stories.length; i++) {
                runningSession.stories.push(setupStoryForRun(runData.stories[i].id, runData.stories[i].scenarios));
                runningSession.totalScenarios += runData.stories[i].scenarios.length;
            }

            $run.setupRunTitle(runningSession).then(function (translatedTitle) {
                runningSession.title = translatedTitle;
            });
            runningSessions.unshift(runningSession);
            $subscription.subscribe(runData.id);
        };

        var handleRunGist = function (runGist) {
            var i, j;
            for (i = 0; i < runGist.stories.length; i++) {
                for (j = 0; j < runGist.stories[i].scenarios.length; j++) {
                    handleRunUpdate({
                        id: runGist.id,
                        status: runGist.status,
                        story: {
                            id: runGist.stories[i].id,
                            status: runGist.stories[i].status,
                            scenario: {
                                id: runGist.stories[i].scenarios[j].id,
                                status: runGist.stories[i].scenarios[j].status,
                                steps: runGist.stories[i].scenarios[j].steps
                            }
                        }
                    });
                }
            }
        };

        var handleRunUpdate = function (runUpdate) {
            var run = findRun(runUpdate.id);
            if (run === null) {
                $subscription.unSubscribe(runUpdate.id);
                return;
            }
            run.status = runUpdate.status;
            var story = $run.findStoryInRun(run, runUpdate.story.id);
            story.status = runUpdate.story.status;
            if (story === null) {
                throw new Error('Server and client story data set are out of sync');
            }
            var scenario = $run.findScenarioInStory(story, runUpdate.story.scenario.id);
            if (scenario === null) {
                throw new Error('Server and client story data set are out of sync');
            }
            scenario.status = runUpdate.story.scenario.status;
            if (scenario.status === STATE.RUN.SCENARIO.SUCCESS || scenario.status === STATE.RUN.SCENARIO.FAILED) {
                run.scenariosCompleted++;
                story.scenariosCompleted++;
                if (scenario.status === STATE.RUN.SCENARIO.FAILED) {
                    run.scenariosFailed++;
                }
            }
            for (var i = 0; i < runUpdate.story.scenario.steps.length; i++) {
                scenario.steps[i].status = runUpdate.story.scenario.steps[i].status;
                scenario.steps[i].message = runUpdate.story.scenario.steps[i].message;
            }
            if ($run.runIsCompleted(run)) {
                handleCompletedRun(run);
            }
        };

        var handleCompletedRun = function (run) {
            $subscription.unSubscribe(run.id);
            $run.removeRun(run.id);
            if (run.status === STATE.RUN.SCENARIO.FAILED) {
                var pluralized = $utils.pluralize(run.scenariosFailed);
                $feedback.error(FEEDBACK.ERROR.RUN.COMPLETED[pluralized.template], {
                    failedCount: pluralized.value,
                    title: run.title
                });
            } else {
                $feedback.success(FEEDBACK.SUCCESS.RUN.COMPLETED, {
                    title: run.title
                });
            }
            $module.updateModuleBadge(MODULES.RUNNER, ['run-' + run.id], true);
            $module.updateSectionBadge(MODULES.RUNNER.sections.REPORTS, ['run-' + run.id], true);
            $module.updateSectionBadge(MODULES.RUNNER.sections.RUNNING, ['run-' + run.id], false);
        };

        var findRun = function (runId) {
            for (var i = 0; i < runningSessions.length; i++) {
                if (runningSessions[i].id === runId) {
                    return runningSessions[i];
                }
            }
            return null;
        };

        var setupStoryForRun = function (storyId, scenarios) {
            var story = angular.copy($story.findStoryById(storyId));
            var i, j, keep;
            angular.extend(story, {
                status: STATE.RUN.SCENARIO.RUNNING,
                scenariosCompleted: 0
            });
            for (i = 0; i < story.scenarios.length; i++) {
                keep = false;
                for (j = 0; j < scenarios.length; j++) {
                    if (scenarios[j].id === story.scenarios[i].id) {
                        keep = true;
                        break;
                    }
                }
                if (keep) {
                    angular.extend(story.scenarios[i], {
                        status: STATE.RUN.SCENARIO.RUNNING,
                        stepsCompleted: 0
                    });
                    for (j = 0; j < story.scenarios[i].steps.length; j++) {
                        angular.extend(story.scenarios[i].steps[j], {
                            status: STATE.RUN.SCENARIO.QUEUED
                        });
                    }
                } else {
                    story.scenarios.splice(i--, 1);
                }
            }
            return story;
        };

        var handleNewReport = function (runData) {
            $report.addNewReport(runData);
            $timeout($reporterFilter.initialize);
        };

    });
