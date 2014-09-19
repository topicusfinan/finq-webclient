'use strict';

/**
 * @ngdoc function
 * @name finqApp.filter:storySearchFilter
 * @description
 * # Story search filter
 *
 * Allows for filtering using custom search queries. This uses the bloodhound engine to
 * search using keywords. It limits the search to the title of scenarios and will not query
 * the title of steps.
 *
 * This filter assumes that the storySearchService has has been initialized with the booklist
 * to use.
 */
angular.module('finqApp.filter')
    .filter('storySearchFilter', ['storyFilter', function(storyFilterService) {
        return function(stories, query, bookId) {
            return storyFilterService.storySearch(stories,query,bookId);
        };
    }]);
