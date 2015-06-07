'use strict';

/**
 * @ngdoc overview
 * @name finqApp.runner.controller:ReportsCtrl
 * @description
 * # Run reports controller
 *
 * The report controller allows the user to view reports of runs that were executed in the past. Any
 * completed run has a report, so this includes successful and failed runs. Once a run completes it
 * is immediately "moved" to the reports section.
 */
angular.module('finqApp.runner.controller')
    .controller('ReportsCtrl', [
        '$scope',
        'config',
        'value',
        'report',
        'reporterFilter',
        'module',
        '$timeout',
        '$location',
        'MODULES',
        'EVENTS',
        'FEEDBACK',
        'feedback',
        function ($scope,configProvider,valueService,reportService,reporterFilterService,moduleService,$timeout,$location,MODULES,EVENTS,FEEDBACK,feedbackService) {
            var that = this;

            this.filter = {
                status: {id: 'status', ids: []}
            };
            this.searchQuery = '';
            this.selectedItem = null;
            this.reportListRef = 'reportList';
            this.maxReports = configProvider.client().report.pagination.client.reportsPerPage;
            this.maxSelectItems = configProvider.client().selectDropdown.pagination.itemsPerPage;
            this.currentPage = 0;
            this.hasMorePages = valueService.hasMorePages;

            $scope.reportList = reporterFilterService.getFilteredReports;
            $scope.initialized = reporterFilterService.isInitialized;

            $scope.$on(EVENTS.SCOPE.FILTER_SELECT_UPDATED, function (event, filterInfo) {
                that.filter[filterInfo.id].ids = filterInfo.keys;
                reporterFilterService.applyFilter(that.filter.status.ids, that.searchQuery);
            });

            $scope.$on(EVENTS.SCOPE.SEARCH_UPDATED, function (event, query) {
                that.searchQuery = query;
                reporterFilterService.applyFilter(that.filter.set.ids, that.filter.tag.ids, that.searchQuery);
            });

            moduleService.setCurrentSection(MODULES.RUNNER.sections.REPORTS);

            $timeout(function() {
                // we reapply the filter after an initial delay to ensure that titles for reports are properly defined
                reporterFilterService.applyFilter();
            },100);

            this.get = function(reportId) {
                reportService.getReport(reportId).then(function() {
                    $location.path('/'+MODULES.RUNNER.sections.REPORTS.id.toLowerCase().replace('.','/')+'/'+reportId);
                }, function() {
                    feedbackService.error(FEEDBACK.ERROR.REPORT.UNABLE_TO_LOAD);
                });
            };

        }]);
