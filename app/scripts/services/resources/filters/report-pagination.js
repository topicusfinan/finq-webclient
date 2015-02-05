'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.filter:reportPagination
 * @description
 * # Paginate report listings
 *
 * Makes it possible to paginate lists using a calulated offset for
 * the paginated items to render. Use this in case you wish to drop
 * results before a certain record to avoid putting too many elements
 * on screen at once.
 */
angular.module('finqApp.runner.filter')
    .filter('reportPaginationFilter', ['value', function (valueService) {
        return function (reports, iteration, maxReports) {
            var filteredReports = [],
                maxIndex = Math.min(maxReports * (iteration + 1), reports.length);

            for (var i = iteration * maxReports; i < maxIndex; i++) {
                filteredReports.push(reports[i]);
            }

            valueService.hasMorePages = maxIndex < reports.length;

            return filteredReports;
        };
    }]);
