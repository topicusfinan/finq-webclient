'use strict';

/**
 * @ngdoc function
 * @name finqApp.filter:storySet
 * @description
 * # Storybook set filter
 *
 * Allows the filtering of story books by supplying the a certain set. Only books with stories that are linked
 * to the supplied set will remain, and only the stories in that book that are linked will be in the result.
 */
angular.module('finqApp.filter')
    .filter('storyBookSet', function() {
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
