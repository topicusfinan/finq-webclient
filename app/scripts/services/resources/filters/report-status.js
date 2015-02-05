'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.filter:reportStatusFilter
 * @description
 * # Report status filter
 *
 * Allows the filtering of reports by supplying a specific status.
 */
angular.module('finqApp.runner.filter')
    .filter('reportStatusFilter', function () {
        return function (reports, statusesToInclude) {
            var filteredReports = [];
            if (!statusesToInclude.length) {
                return reports;
            }
            angular.forEach(reports, function (report) {
                if (statusesToInclude.indexOf(report.status) > -1) {
                    filteredReports.push(report);
                }
            });

            return filteredReports;
        };
    });
