'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.filter:storybookSearchFilter
 * @description
 * # Storybook search filter
 *
 * Allows for filtering using custom search queries. This uses the bloodhound engine to
 * search using keywords. It limits the search to the title of scenarios and will not query
 * the title of steps.
 *
 * This filter ignores the supplied books and assumes that the storybookSearchService has
 * has been initialized with the booklist to use.
 */
angular.module('finqApp.runner.filter')
    .filter('storybookSearchFilter', ['storybookSearch', function (storybookSearchService) {
        return function (books, query) {
            var filteredBooks = [];
            if (query === '') {
                return books;
            }
            var bookIds = storybookSearchService.suggest(query);
            angular.forEach(books, function (book) {
                if (bookIds.indexOf(book.id) !== -1) {
                    filteredBooks.push(book);
                }
            });

            return filteredBooks;
        };
    }]);
