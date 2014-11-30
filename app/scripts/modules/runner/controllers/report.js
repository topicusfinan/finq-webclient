'use strict';

/**
 * @ngdoc overview
 * @name finqApp.runner.controller:ReportCtrl
 * @description
 * # Run report controller
 *
 * The report controller allows the user to view reports of runs that were executed in the past. Any
 * completed run has a report, so this includes successful and failed runs. Once a run completes it
 * is immediately "moved" to the reports section.
 */
angular.module('finqApp.runner.controller')
    .controller('ReportCtrl', [
        '$scope',
        'config',
        'value',
        'reporterFilter',
        'module',
        '$timeout',
        'MODULES',
        'EVENTS',
        function ($scope,configProvider,valueService,reporterFilterService,moduleService,$timeout,MODULES,EVENTS) {
            var that = this;

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
            $scope.initialized = reporterFilterService.isInitialized;

            $scope.$on(EVENTS.SCOPE.FILTER_SELECT_UPDATED, function (event, filterInfo) {
                that.filter[filterInfo.id].ids = filterInfo.keys;
                reporterFilterService.applyFilter(that.filter.status.ids);
            });

            moduleService.setCurrentSection(MODULES.RUNNER.sections.REPORT);

            $timeout(function() {
                // we reapply the filter after an initial delay to ensure that titles for reports are properly defined
                reporterFilterService.applyFilter();
            },100);

        }]);
