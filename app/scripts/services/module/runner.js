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
    .service('runner', ['module','MODULES','EVENTS',function (moduleService,MODULES,EVENTS) {

        this.handle = function(event,eventData) {
            switch (event) {
                case EVENTS.INTERNAL.SCENARIO_RUN_STARTED:
                    handleScenarioRunStarted(eventData);
                    break;
                default: break;
            }
        };

        var handleScenarioRunStarted = function(runData) {
            moduleService.updateModuleBadge(MODULES.RUNNER,1);
            moduleService.updateSectionBadge(MODULES.RUNNER.sections.RUNNING,runData.scenarios.length);
        };

    }]);
