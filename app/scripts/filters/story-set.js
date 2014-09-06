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
        return function(stories, setToInclude) {
            var filteredStories = [];
            if (setToInclude === null) {
                return stories;
            }
            angular.forEach(stories, function(story) {
                var include = false;
                angular.forEach(story.sets, function(set) {
                    if (set === setToInclude) {
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
