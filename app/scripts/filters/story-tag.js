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
        return function(stories, tagToInclude) {
            var filteredStories = [];
            if (tagToInclude === null) {
                return stories;
            }
            angular.forEach(stories, function(story) {
                var include = false;
                angular.forEach(story.tags, function(tag) {
                    if (tag === tagToInclude) {
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
