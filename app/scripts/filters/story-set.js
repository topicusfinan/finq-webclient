'use strict';

/**
 * @ngdoc function
 * @name finqApp.filter:storySetFilter
 * @description
 * # Story set filter
 *
 * Allows the filtering of stories by supplying the a certain set. Only the stories in that are linked to the supplied
 * set will be in the result.
 */
angular.module('finqApp.filter')
    .filter('storySetFilter', function() {
        return function(stories, setsToInclude) {
            var filteredStories = [];
            if (!setsToInclude.length) {
                return stories;
            }
            angular.forEach(stories, function(story) {
                var include = false;
                angular.forEach(story.sets, function(set) {
                    if (setsToInclude.indexOf(set) > -1) {
                        include = true;
                    }
                });
                if (include) {
                    filteredStories.push(story);
                }
            });

            return filteredStories;
        };
    });
