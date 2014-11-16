'use strict';

/**
 * @ngdoc overview
 * @name finqApp.reporter.controller:HistoryCtrl
 * @description
 * # Run history report controller
 *
 * The history controller allows the user to view reports of runs that were executed in the past. Any
 * completed run has a report, so this includes successful and failed runs. Once a run completes it
 * is immediately "moved" to the reports section.
 */
angular.module('finqApp.reporter.controller')
    .controller('HistoryCtrl', [
        '$scope',
        'config',
        'value',
        'reporterFilter',
        function ($scope,configProvider,valueService,reporterFilterService) {

            this.filter = {
                status: {id: 'status', ids: []}
            };
            this.selectedItem = null;
            this.reportListRef = 'reports';
            this.maxReports = configProvider.client().report.pagination.client.reportsPerPage;
            this.maxSelectItems = configProvider.client().selectDropdown.pagination.itemsPerPage;
            this.currentPage = 0;
            this.hasMorePages = valueService.hasMorePages;

            $scope.reports = reporterFilterService.getFilteredReports;
            $scope.initialized = reporterFilterService.initialized;

        }]);
