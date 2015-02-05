'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.filter:storybookPagination
 * @description
 * # Paginate storybook listings
 *
 * Makes it possible to paginate lists using a calulated offset for
 * the paginated items to render. Use this in case you wish to drop
 * results before a certain record to avoid putting too many elements
 * on screen at once.
 */
angular.module('finqApp.runner.filter')
    .filter('storybookPaginationFilter', ['value', function (valueService) {
        return function (books, iteration, maxScenarios) {
            var filteredBooks = [],
                scenarioCnt = 0,
                loopIteration = 0,
                morePagesAvailable = false,
                i, j;
            for (i = 0; i < books.length; i++) {
                for (j = 0; j < books[i].stories.length; j++) {
                    scenarioCnt += books[i].stories[j].scenarios.length;
                }
                if (loopIteration === iteration) {
                    filteredBooks.push(books[i]);
                }
                if (scenarioCnt >= maxScenarios) {
                    if (loopIteration === iteration) {
                        morePagesAvailable = i < books.length - 1;
                        break;
                    } else {
                        scenarioCnt = 0;
                        loopIteration++;
                    }
                }
            }

            valueService.hasMorePages = morePagesAvailable;

            return filteredBooks;
        };
    }]);
