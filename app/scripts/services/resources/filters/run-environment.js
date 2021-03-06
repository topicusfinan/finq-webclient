'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.filter:runEnvironmentFilter
 * @description
 * # Run environment filter
 *
 * Allows the filtering of runs by supplying a specific environment.
 */
angular.module('finqApp.runner.filter')
    .filter('runEnvironmentFilter', function () {
        return function (runs, environmentsToInclude) {
            var filteredRuns = [];
            if (!environmentsToInclude.length) {
                return runs;
            }
            angular.forEach(runs, function (run) {
                if (environmentsToInclude.indexOf(run.environment.id) > -1) {
                    filteredRuns.push(run);
                }
            });

            return filteredRuns;
        };
    });
