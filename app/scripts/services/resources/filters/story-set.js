'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.filter:storySetFilter
 * @description
 * # Story set filter
 *
 * Allows the filtering of stories by supplying a list of sets. Only the stories in that are linked to the supplied
 * sets will be in the result.
 */
angular.module('finqApp.runner.filter')
    .filter('storySetFilter', function() {
        return function(stories, setsToInclude) {
            var filteredStories = [];
            if (!setsToInclude.length) {
                return stories;
            }
            angular.forEach(stories, function(story) {
                var include = false;
                angular.forEach(story.sets, function(set) {
                    if (setsToInclude.indexOf(set.id) > -1) {
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
