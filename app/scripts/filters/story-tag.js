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
    .filter('storyTagFilter', ['storyFilter', function(storyFilterService) {
        return function(stories, tagsToInclude) {
            return storyFilterService.storyTag(stories,tagsToInclude);
        };
    }]);
