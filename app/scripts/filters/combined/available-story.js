'use strict';

/**
 * @ngdoc function
 * @name finqApp.filter:availableStoryFilter
 * @description
 * # Combined story filter
 *
 * A combined story filter for the availability page that makes it possible to apply
 * several filters while only referencing a single filter. This way better performance can
 * be achieved as the digest cycle is not repeated too often.
 */
angular.module('finqApp.filter')
    .filter('availableStoryFilter', ['$filter', function($filter) {
        return function(stories, query, bookId, setsToInclude, tagsToInclude) {
            var filteredStories = [],
                searchFilter = $filter('storySearchFilter'),
                setFilter = $filter('storySetFilter'),
                tagFilter = $filter('storyTagFilter');

            filteredStories = searchFilter(stories,query,bookId);
            filteredStories = setFilter(filteredStories,setsToInclude);
            filteredStories = tagFilter(filteredStories,tagsToInclude);

            return filteredStories;
        };
    }]);
