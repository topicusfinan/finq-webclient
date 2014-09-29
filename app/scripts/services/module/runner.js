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
            runningScenarios = {};

        this.handle = function(event,eventData) {
            switch (event) {
                case EVENTS.INTERNAL.SCENARIO_RUN_STARTED:
                    handleScenarioRunStarted(eventData);
                    break;
                case EVENTS.SOCKET.RUN_STATUS_UPDATED:
                    handleRunUpdate(eventData);
                    break;
                default: break;
            }
        };

        var handleRunUpdate = function(runData) {
            if (runningScenarios[runData.id]) {
                runningScenarios[runData.id].progress = runData.progress;
            }
        };

        var handleScenarioRunStarted = function(runData) {
            moduleService.updateModuleBadge(MODULES.RUNNER,1);
            moduleService.updateSectionBadge(MODULES.RUNNER.sections.RUNNING,runData.scenarios.length);
            angular.forEach(runData.scenarios,function(scenarioId) {
                var scenario = storyService.findScenarioById(scenarioId);
                runningScenarios[runData.id] = {
                    scenario: scenario,
                    progress: {
                        currentStep: null,
                        status: undefined,
                        message: undefined
                    }
                };
            });
            subscriptionService.subscribe(EVENTS.SOCKET.RUN_STATUS_UPDATED,{run: runData.id});
            if (!updateListener) {
                updateListener = subscriptionService.register(EVENTS.SOCKET.RUN_STATUS_UPDATED, that.handle);
            }
        };

    }]);
