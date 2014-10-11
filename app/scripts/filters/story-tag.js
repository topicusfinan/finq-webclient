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
    .filter('storyTagFilter', function() {
        return function(stories, tagsToInclude) {
            var filteredStories = [],
                i, j, k;

            if (!tagsToInclude.length) {
                return stories;
            }
            for (i=0; i<stories.length; i++) {
                var include = false;
                for (j=0; j<stories[i].tags.length; j++) {
                    if (tagsToInclude.indexOf(stories[i].tags[j].id) > -1) {
                        include = true;
                        break;
                    }
                }
                if (!include) {
                    for (j=0; j<stories[i].scenarios.length; j++) {
                        for (k=0; k<stories[i].scenarios[j].tags.length; k++) {
                            if (tagsToInclude.indexOf(stories[i].scenarios[j].tags[k].id) > -1) {
                                include = true;
                                break;
                            }
                        }
                        if (include) {
                            break;
                        }
                    }
                }
                if (include) {
                    filteredStories.push(stories[i]);
                }
            }

            return filteredStories;
        };
    });
