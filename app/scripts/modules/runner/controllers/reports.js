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
    .controller('ReportsCtrl', function ($scope, $timeout, $location, MODULES, EVENTS, FEEDBACK, $config, $value, $report, $reporterFilter, $module, $feedback) {
        var that = this;

        this.filter = {
            status: {id: 'status', ids: []}
        };
        this.searchQuery = '';
        this.selectedItem = null;
        this.reportListRef = 'reportList';
        this.maxReports = $config.client().report.pagination.client.reportsPerPage;
        this.maxSelectItems = $config.client().selectDropdown.pagination.itemsPerPage;
        this.currentPage = 0;
        this.hasMorePages = $value.hasMorePages;

        $scope.reportList = $reporterFilter.getFilteredReports;
        $scope.initialized = $reporterFilter.isInitialized;

        $scope.$on(EVENTS.SCOPE.FILTER_SELECT_UPDATED, function (event, filterInfo) {
            that.filter[filterInfo.id].ids = filterInfo.keys;
            $reporterFilter.applyFilter(that.filter.status.ids, that.searchQuery);
        });

        $scope.$on(EVENTS.SCOPE.SEARCH_UPDATED, function (event, query) {
            that.searchQuery = query;
            $reporterFilter.applyFilter(that.filter.set.ids, that.filter.tag.ids, that.searchQuery);
        });

        $module.setCurrentSection(MODULES.RUNNER.sections.REPORTS);

        $timeout(function () {
            // we reapply the filter after an initial delay to ensure that titles for reports are properly defined
            $reporterFilter.applyFilter();
        }, 100);

        this.get = function (reportId) {
            $report.getReport(reportId).then(function () {
                $location.path('/' + MODULES.RUNNER.sections.REPORTS.id.toLowerCase().replace('.', '/') + '/' + reportId);
            }, function () {
                $feedback.error(FEEDBACK.ERROR.REPORT.UNABLE_TO_LOAD);
            });
        };

    });
