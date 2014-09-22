'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:storyRun
 * @description
 * # Story run service
 *
 * Execute a scenario or a collection of scenarios.
 *
 */
angular.module('finqApp.service')
    .service('storyRun', function () {

        this.runScenario = function(scenarioId) {
            console.log(scenarioId);
        };

        this.runScenarios = function(scenarioIds) {
            console.log(scenarioIds);
        };

    });
