'use strict';

/**
 * @ngdoc function
 * @name finqApp.filter:availableStorybookFilter
 * @description
 * # Combined storybook filter
 *
 * A combined storybook filter for the availability page that makes it possible to apply
 * several filters while only referencing a single filter. This way better performance can
 * be achieved as the digest cycle is not repeated too often.
 */
angular.module('finqApp.filter')
    .filter('availableStorybookFilter', ['$filter', function($filter) {
        return function(books, query, setsToInclude, tagsToInclude, iteration, maxScenarios) {
            var filteredBooks = [],
                searchFilter = $filter('storybookSearchFilter'),
                setFilter = $filter('storybookSetFilter'),
                tagFilter = $filter('storybookTagFilter'),
                paginationFilter = $filter('storybookPaginationFilter');

            filteredBooks = searchFilter(books,query);
            filteredBooks = setFilter(filteredBooks,setsToInclude);
            filteredBooks = tagFilter(filteredBooks,tagsToInclude);
            filteredBooks = paginationFilter(filteredBooks,iteration,maxScenarios);

            return filteredBooks;
        };
    }]);
