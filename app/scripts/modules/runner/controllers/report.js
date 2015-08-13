'use strict';
/*global StoryExpandCollapse:false */

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
    .controller('ReportCtrl', function ($scope, $routeParams, $location, MODULES, FEEDBACK, STATE, $report, $module, $feedback, $runUtils) {
        var that = this;
        this.selectedItem = null;
        this.loaded = false;
        this.runCompleted = true;

        this.list = function () {
            $location.path('/' + MODULES.RUNNER.sections.REPORTS.id.toLowerCase().replace('.', '/'));
        };

        $report.getReport($routeParams.reportId).then(function (report) {
            $scope.run = report;
            that.loaded = true;
            if (report.status === STATE.RUN.RUNNING) {
                that.runCompleted = false;
            }
            setupRunProgress(report);
        }, function () {
            $feedback.error(FEEDBACK.ERROR.REPORT.UNABLE_TO_LOAD);
        });

        $module.setCurrentSection(MODULES.RUNNER.sections.REPORTS);

        var setupRunProgress = function (report) {
            angular.forEach(report.stories, function (story) {
                story.scenariosCompleted = 0;
                angular.forEach(story.scenarios, function (scenario) {
                    if (scenario.status === STATE.SUCCESS) {
                        story.scenariosCompleted++;
                    }
                });
            });
            $runUtils.determineDetailedProgress(report);
        };

    });
