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
    .filter('storySetFilter', ['storyFilter', function(storyFilterService) {
        return function(stories, setsToInclude) {
            return storyFilterService.storySet(stories,setsToInclude);
        };
    }]);
