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
    .service('runnerMockSimulator', ['socket','STATE','EVENTS','config','$timeout', function (socketService,STATE,EVENTS,configProvider,$timeout) {
        var runs = [];

        this.registerRun = function(runData) {
            var stories = [];
            angular.forEach(runData.stories, function(story) {
                var scenarios = [];
                for (var i=0; i<story.scenarios.length; i++) {
                    scenarios.push({status: STATE.RUN.SCENARIO.RUNNING});
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

        var simulateRunResponses = function() {
            var i,j,k, scenarioDone, updateAvailable;
            for (i=0; i<runs.length; i++) {
                updateAvailable = false;
                if (Math.random() > configProvider.client().mock.runSimulation.runSelectChance) {
                    continue;
                }
                for (j=0; j<runs[i].progress.stories.length; j++) {
                    if (Math.random() < Math.pow(configProvider.client().mock.runSimulation.storySelectChance,Math.max(runs[i].progress.stories.length,8))) {
                        scenarioDone = false;
                        for (k=0; k<runs[i].progress.stories[j].scenarios.length; k++) {
                            if (Math.random() < Math.pow(configProvider.client().mock.runSimulation.scenarioSelectChance,Math.max(runs[i].progress.stories[i].scenarios.length,8))) {
                                scenarioDone = generateScenarioStatusUpdate(runs[i].progress.stories[j].scenarios[k]);
                                if (scenarioDone) {
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
                var random = Math.random();
                if (random < configProvider.client().mock.runSimulation.scenarioFailChance) {
                    scenario.status = STATE.RUN.SCENARIO.FAILED;
                    return true;
                } else if (random < configProvider.client().mock.runSimulation.scenarioFailChance + configProvider.client().mock.runSimulation.scenarioSuccessChance) {
                    scenario.status = STATE.RUN.SCENARIO.SUCCESS;
                    return true;
                }
            }
            return false;
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
