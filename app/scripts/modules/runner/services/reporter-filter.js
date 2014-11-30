'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.service:reporterFilter
 * @description
 * # Report filter service
 *
 * A service that handles the filtering of reports and keeps them in a filtered state to avoid
 * unnecessary refiltering by the controller.
 */
angular.module('finqApp.runner.service')
    .service('reporterFilter', [
        '$filter',
        'report',
        '$q',
        function ($filter,reportService,$q) {
            var that = this,
                initialized = false,
                reportStatusFilter = $filter('reportStatusFilter'),
                unfilteredReports = [],
                initializing = false,
                filteredReports = [],
                lastFilter = {
                    statuses: []
                };

            this.isInitialized = function() {
                return initialized;
            };
            this.initialize = function() {
                var deferred = $q.defer();
                reportService.list().then(function(reports) {
                    unfilteredReports = reports;
                    that.applyFilter();
                    deferred.resolve();
                    initializing = false;
                    initialized = true;
                });
                initializing = true;
                return deferred.promise;
            };

            this.applyFilter = function(statuses) {
                if (!statuses) {
                    statuses = lastFilter.statuses;
                } else {
                    lastFilter.statuses = statuses;
                }
                if (!initialized && !initializing) {
                    var deferred = $q.defer();
                    that.initialize().then(function() {
                        deferred.resolve(filteredReports);
                    });
                    return deferred.promise;
                } else {
                    filteredReports = reportStatusFilter(angular.copy(unfilteredReports),statuses);
                    updateStates(filteredReports);
                    return $q.when(filteredReports);
                }
            };

            this.getFilteredReports = function() {
                if (!initialized && !initializing) {
                    that.initialize();
                    return [];
                }
                return filteredReports;
            };

            this.getLastFilter = function() {
                return lastFilter;
            };

            var updateStates = function(reports) {
                angular.forEach(reports, function(report) {
                    report.status = report.status.toLowerCase();
                });
            };

        }]);
