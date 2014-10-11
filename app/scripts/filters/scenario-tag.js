'use strict';

/**
 * @ngdoc function
 * @name finqApp.filter:storyTagFilter
 * @description
 * # Story tag filter
 *
 * Allows the filtering of stories by supplying the a certain tag. Only the stories in that are linked to the supplied
 * tag will be in the result.
 */
angular.module('finqApp.filter')
    .filter('scenarioTagFilter', function() {
        return function(scenarios, storyTags, tagsToInclude) {
            var filteredScenarios = [],
                i, j;
            if (!tagsToInclude.length) {
                return scenarios;
            }
            for (i=0; i<storyTags.length; i++) {
                if (tagsToInclude.indexOf(storyTags[i].id) > -1) {
                    return scenarios;
                }
            }
            for (i=0; i<scenarios.length; i++) {
                for (j=0; j<scenarios[i].tags.length; j++) {
                    if (tagsToInclude.indexOf(scenarios[i].tags[j].id) > -1) {
                        filteredScenarios.push(scenarios[i]);
                        break;
                    }
                }
            }

            return filteredScenarios;
        };
    });
