'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.filter:reportSearchFilter
 * @description
 * # Report search filter
 *
 * Allows for filtering using custom search queries. This uses the bloodhound engine to
 * search using keywords. It limits the search to the title of reports and will not query
 * the details of the report.
 *
 * This filter ignores the supplied books and assumes that the storybookSearchService has
 * has been initialized with the booklist to use.
 */
angular.module('finqApp.runner.filter')
    .filter('reportSearchFilter', function($reportSearch) {
        return function(reports, query) {
            var filteredReports = [];
            if (query === '') {
                return reports;
            }
            var reportIds = $reportSearch.suggest(query);
            angular.forEach(reports, function(report) {
                if (reportIds.indexOf(report.id) !== -1) {
                    filteredReports.push(report);
                }
            });

            return filteredReports;
        };
    });
