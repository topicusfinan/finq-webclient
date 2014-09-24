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
            runningScenarios = [];

        this.handle = function(event,eventData) {
            switch (event) {
                case EVENTS.INTERNAL.SCENARIO_RUN_STARTED:
                    handleScenarioRunStarted(eventData);
                    break;
                default: break;
            }
        };

        this.handleRunUpdate = function() {
            // TODO determine how to handle run update info by defining what kind of update info
            // can be received and how it should update the running scenarios data
        };

        var handleScenarioRunStarted = function(runData) {
            moduleService.updateModuleBadge(MODULES.RUNNER,1);
            moduleService.updateSectionBadge(MODULES.RUNNER.sections.RUNNING,runData.scenarios.length);
            angular.forEach(runData.scenarios,function(scenarioId) {
                var scenario = storyService.findScenarioById(scenarioId);
                runningScenarios.push({
                    sessionId: runData.id,
                    scenario: scenario,
                    progress: {
                        currentStep: null,
                        status: undefined
                    }
                });
            });
            subscriptionService.subscribe(runData.id,that.handleRunUpdate);
        };

    }]);
