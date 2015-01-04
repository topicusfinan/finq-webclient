'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.service:runnerMockSimulator
 * @description
 * # Runner service mock simulator
 *
 * This service mocks the behavior of the backend when a story run is started by providing randomized
 * result information.
 */
angular.module('finqApp.runner.service')
    .service('runnerMockSimulator', ['socket','STATE','EVENTS','config','$timeout','story','$q','run', function (socketService,STATE,EVENTS,configProvider,$timeout,storyService,$q,runService) {
        var runs = [],
            active = false;

        this.registerRun = function(runData) {
            var deferred = $q.defer();
            storyService.list().then(function() {
                var stories = [];
                angular.forEach(runData.stories, function (story) {
                    var scenarios = [];
                    for (var i = 0; i < story.scenarios.length; i++) {
                        scenarios.push({
                            id: story.scenarios[i],
                            status: STATE.RUN.SCENARIO.RUNNING,
                            steps: setupStepsForScenario(story.scenarios[i])
                        });
                    }
                    stories.push({
                        id: story.id,
                        status: STATE.RUN.SCENARIO.RUNNING,
                        scenarios: scenarios
                    });
                });
                runs.push({
                    id: runData.id,
                    status: STATE.RUN.SCENARIO.RUNNING,
                    stories: stories
                });
                if (!active) {
                    $timeout(simulateRunResponses, configProvider.client().mock.runSimulation.interval);
                    active = true;
                }
                deferred.resolve();
            });
            return deferred.promise;
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
            var i,j,k, scenarioHasUpdate;
            for (i=0; i<runs.length; i++) {
                if (Math.random() > configProvider.client().mock.runSimulation.runSelectChance) {
                    continue;
                }
                for (j=0; j<runs[i].stories.length; j++) {
                    if (Math.random() < Math.pow(configProvider.client().mock.runSimulation.storySelectChance,Math.max(runs[i].stories.length,8))) {
                        scenarioHasUpdate = false;
                        for (k=0; k<runs[i].stories[j].scenarios.length; k++) {
                            if (Math.random() < Math.pow(configProvider.client().mock.runSimulation.scenarioSelectChance,Math.max(runs[i].stories[j].scenarios.length,8))) {
                                scenarioHasUpdate = generateScenarioStatusUpdate(runs[i].stories[j].scenarios[k]);
                                if (scenarioHasUpdate) {
                                    updateCollectionStatus(runs[i].stories[j],runs[i].stories[j].scenarios);
                                    updateCollectionStatus(runs[i],runs[i].stories);
                                    publishSimulatedResponse(runs[i],runs[i].stories[j],runs[i].stories[j].scenarios[k]);
                                }
                            }
                        }
                    }
                }
            }
            if (validateCompletedRuns()) {
                $timeout(simulateRunResponses, configProvider.client().mock.runSimulation.interval);
            } else {
                active = false;
            }
        };

        var updateCollectionStatus = function(collection, collectives) {
            var collectivesCompleted = 0;
            var hasFailedCollective = false;
            for (var i=0; i<collectives.length; i++) {
                if (collectives[i].status === STATE.RUN.SCENARIO.SUCCESS) {
                    collectivesCompleted++;
                } else if (collectives[i].status === STATE.RUN.SCENARIO.FAILED) {
                    hasFailedCollective = true;
                }
            }
            if (hasFailedCollective) {
                collection.status = STATE.RUN.SCENARIO.FAILED;
            } else if (collectivesCompleted === collectives.length) {
                collection.status = STATE.RUN.SCENARIO.SUCCESS;
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
                    if (currentStepResult === STATE.RUN.SCENARIO.FAILED) {
                        scenario.steps[i].message = 'Fate determined that it was to be so';
                    } else if (scenario.steps.length > i+1) {
                        scenario.steps[i+1].status = STATE.RUN.SCENARIO.RUNNING;
                        return false;
                    }
                    break;
                }
            }
            return true;
        };

        var publishSimulatedResponse = function(run,story,scenario) {
            var runUpdate = {
                id: run.id,
                status: run.status,
                story: {
                    id: story.id,
                    status: story.status,
                    scenario: {
                        id: scenario.id,
                        status: scenario.status,
                        steps: scenario.steps
                    }
                }
            };

            socketService.emit(EVENTS.SOCKET.RUN.UPDATED,runUpdate);
        };

        var validateCompletedRuns = function() {
            var completedRuns = [], i;
            for (i=0; i<runs.length; i++) {
                if (runService.runIsCompleted(runs[i])) {
                    completedRuns = completedRuns.concat(runs.splice(i--,1));
                }
            }
            for (i=0; i<completedRuns.length; i++) {
                socketService.emit(EVENTS.SOCKET.RUN.COMPLETED, completedRuns[i]);
            }
            return runs.length;
        };

    }]);
