'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.filter:scenarioTagFilter
 * @description
 * # Scenario tag filter
 *
 * Allows the filtering of scenarios by supplying a list of tags. Only the scenarios in that are linked to
 * the supplied tags, or which are part of a story that is linked to one of the tags, will be in the result.
 */
angular.module('finqApp.runner.filter')
    .filter('scenarioTagFilter', function () {
        return function (scenarios, storyTags, tagsToInclude) {
            var filteredScenarios = [],
                i, j;
            if (!tagsToInclude.length) {
                return scenarios;
            }
            for (i = 0; i < storyTags.length; i++) {
                if (tagsToInclude.indexOf(storyTags[i].id) > -1) {
                    return scenarios;
                }
            }
            for (i = 0; i < scenarios.length; i++) {
                for (j = 0; j < scenarios[i].tags.length; j++) {
                    if (tagsToInclude.indexOf(scenarios[i].tags[j].id) > -1) {
                        filteredScenarios.push(scenarios[i]);
                        break;
                    }
                }
            }

            return filteredScenarios;
        };
    });
