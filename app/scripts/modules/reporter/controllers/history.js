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
angular.module('finqApp.runner.controller')
    .controller('HistoryCtrl', [
        '$scope',
        'config',
        'value',
        'reportFilter',
        function ($scope,configProvider,valueService,reportFilterService) {

            this.filter = {
                status: {id: 'status', ids: []}
            };
            this.selectedItem = null;
            this.reportListRef = 'reports';
            this.maxReports = configProvider.client().report.pagination.client.reportsPerPage;
            this.maxSelectItems = configProvider.client().selectDropdown.pagination.itemsPerPage;
            this.currentPage = 0;
            this.hasMorePages = valueService.hasMorePages;

            $scope.storybooks = reportFilterService.getFilteredReports;
            $scope.initialized = reportFilterService.initialized;

        }]);
