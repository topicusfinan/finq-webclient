'use strict';

/**
 * @ngdoc overview
 * @name finqApp.runner.controller:ReportCtrl
 * @description
 * # Run reports controller
 *
 * The report controller allows the user to view the details of a report or a run of which execution has finished.
 * Any completed run has a report, so this includes successful and failed runs. Once a run completes it
 * is immediately "moved" to the reports section.
 */
angular.module('finqApp.runner.controller')
    .controller('ReportCtrl', [
        '$scope',
        '$routeParams',
        'report',
        'module',
        'MODULES',
        'FEEDBACK',
        'feedback',
        function ($scope,$routeParams,reportService,moduleService,MODULES,FEEDBACK,feedbackService) {
            var that = this;
            this.selectedItem = null;
            this.loaded = false;

            reportService.getReport($routeParams.reportId).then(function(report) {
                $scope.run = report;
                that.loaded = true;
            }, function() {
                feedbackService.error(FEEDBACK.ERROR.REPORT.UNABLE_TO_LOAD);
            });

            moduleService.setCurrentSection(MODULES.RUNNER.sections.REPORTS);

        }]);
