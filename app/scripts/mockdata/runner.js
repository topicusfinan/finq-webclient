'use strict';

/**
 * @ngdoc function
 * @name finqApp.mock:runnerMockSimulator
 * @description
 * # Runner service mock
 *
 * This service mocks the behavior of the backend when a story run is started by providing randomized
 * result information.
 */
angular.module('finqApp.service')
    .service('runnerMockSimulator', ['socket','STATE','EVENTS','config','$timeout','story', function (socketService,STATE,EVENTS,configProvider,$timeout,storyService) {
        var runs = [];

        this.registerRun = function(runData) {
            var stories = [];
            angular.forEach(runData.stories, function(story) {
                var scenarios = [];
                for (var i=0; i<story.scenarios.length; i++) {
                    scenarios.push({
                        status: STATE.RUN.SCENARIO.RUNNING,
                        steps: setupStepsForScenario(story.scenarios[i])
                    });
                }
                stories.push({
                    id: story.id,
                    scenarios: scenarios
                });
            });
            runs.push({
                id: runData.id,
                progress: {
                    stories: stories
                }
            });
            $timeout(simulateRunResponses, configProvider.client().mock.runSimulation.interval);
        };

        var setupStepsForScenario = function(scenarioId) {
            var scenario = storyService.findScenarioById(scenarioId);
            var steps = [];
            if (scenario.steps.length) {
                steps.push({status: STATE.RUN.SCENARIO.RUNNING});
                for (var i=1; i<scenario.steps.length; i++) {
                    steps.push({status: STATE.RUN.SCENARIO.QUEUED});
                }
            }
            return steps;
        };

        var simulateRunResponses = function() {
            var i,j,k, scenarioHasUpdate, updateAvailable;
            for (i=0; i<runs.length; i++) {
                updateAvailable = false;
                if (Math.random() > configProvider.client().mock.runSimulation.runSelectChance) {
                    continue;
                }
                for (j=0; j<runs[i].progress.stories.length; j++) {
                    if (Math.random() < Math.pow(configProvider.client().mock.runSimulation.storySelectChance,Math.max(runs[i].progress.stories.length,8))) {
                        scenarioHasUpdate = false;
                        for (k=0; k<runs[i].progress.stories[j].scenarios.length; k++) {
                            if (Math.random() < Math.pow(configProvider.client().mock.runSimulation.scenarioSelectChance,Math.max(runs[i].progress.stories[i].scenarios.length,8))) {
                                scenarioHasUpdate = generateScenarioStatusUpdate(runs[i].progress.stories[j].scenarios[k]);
                                if (scenarioHasUpdate) {
                                    updateAvailable = true;
                                }
                            }
                        }
                    }
                }
                if (updateAvailable) {
                    publishSimulatedResponse(runs[i]);
                    break;
                }
            }
            if (validateCompletedRuns()) {
                $timeout(simulateRunResponses, configProvider.client().mock.runSimulation.interval);
            }
        };

        var generateScenarioStatusUpdate = function(scenario) {
            if (scenario.status === STATE.RUN.SCENARIO.RUNNING) {
                var resultStatusCurrentStep = STATE.RUN.SCENARIO.RUNNING;
                var random = Math.random();
                if (random < configProvider.client().mock.runSimulation.stepFailChance) {
                    resultStatusCurrentStep = STATE.RUN.SCENARIO.FAILED;
                } else if (random < configProvider.client().mock.runSimulation.stepFailChance + configProvider.client().mock.runSimulation.stepSuccessChance) {
                    resultStatusCurrentStep = STATE.RUN.SCENARIO.SUCCESS;
                }
                if (resultStatusCurrentStep === STATE.RUN.SCENARIO.RUNNING) {
                    return false;
                }
                if (transferToNextStep(scenario, resultStatusCurrentStep)) {
                    scenario.status = resultStatusCurrentStep;
                }
                return true;
            }
            return false;
        };

        var transferToNextStep = function(scenario,currentStepResult) {
            for (var i=0; i<scenario.steps.length; i++) {
                if (scenario.steps[i].status === STATE.RUN.SCENARIO.RUNNING) {
                    scenario.steps[i].status = currentStepResult;
                    if (currentStepResult !== STATE.RUN.SCENARIO.FAILED && scenario.steps.length > i+1) {
                        scenario.steps[i+1].status = STATE.RUN.SCENARIO.RUNNING;
                        return false;
                    }
                }
            }
            return true;
        };

        var publishSimulatedResponse = function(updatedRunData) {
            socketService.emit(EVENTS.SOCKET.RUN_STATUS_UPDATED,updatedRunData);
        };

        var validateCompletedRuns = function() {
            var i,j,k,validRun;
            for (i=0; i<runs.length; i++) {
                validRun = false;
                for (j=0; j<runs[i].progress.stories.length; j++) {
                    for (k=0; k<runs[i].progress.stories[j].scenarios.length; k++) {
                        if (runs[i].progress.stories[j].scenarios[k].status === STATE.RUN.SCENARIO.RUNNING) {
                            validRun = true;
                            break;
                        }
                    }
                    if (validRun) {
                        break;
                    }
                }
                if (!validRun) {
                    runs.splice(i--,1);
                    // TODO: A run complete event should be published here
                }
            }
            return runs.length;
        };

    }]);