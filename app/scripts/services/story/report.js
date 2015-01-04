'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:report
 * @description
 * # Run service
 *
 * Makes it possible to execute list operations on reports of runs that have been completed.
 */
angular.module('finqApp.service')
    .service('report', ['backend','$q','$translate','STATE','config','run','utils',function (backend,$q,$translate,STATE,configProvider,runService,utils) {
        var reports = null,
            report = null;

        var load = function(increment,maxReportsThisRequest) {
            var deferred = $q.defer();
            var reportsPerRequest = configProvider.client().report.pagination.server.reportsPerRequest;
            var maxReports  = configProvider.client().report.pagination.server.maxTotalReports;
            backend.get('/runs',{
                status: [
                    STATE.RUN.SCENARIO.SUCCESS,
                    STATE.RUN.SCENARIO.FAILED
                ],
                size: maxReportsThisRequest || reportsPerRequest,
                page: increment
            }).success(function(runData) {
                transformRunsIntoReports(runData.data);
                if (reports.length < maxReports && runData.totalCount > (increment+1)*reportsPerRequest) {
                    load(increment+1,Math.min(maxReports-reports.length,reportsPerRequest)).then(function() {
                        deferred.resolve(reports);
                    });
                } else {
                    deferred.resolve(reports);
                }
            }).error(function() {
                deferred.reject('Loading reports failed');
            });
            return deferred.promise;
        };

        var transformRunsIntoReports = function(completedRuns) {
            for (var i=0; i<completedRuns.length; i++) {
                createReportForRun(completedRuns[i]);
            }
        };

        var createReportForRun = function(run) {
            var report = {
                id: run.id,
                status: run.status,
                startedBy: run.startedBy,
                startedOn: run.startedOn,
                completedOn: run.completedOn,
                runtime: utils.getTimeElapsed(run.completedOn,run.startedOn),
                environment: run.environment
            };
            runService.setupRunTitle(run).then(function(translatedTitle) {
                report.title = translatedTitle;
            });
            determineReportMessage(run).then(function(translatedMessage) {
                report.message = translatedMessage;
            });
            reports.push(report);
        };

        var determineReportMessage = function(run) {
            var successStories = 0,
                storyCount = run.stories.length,
                pluralized;

            if (run.status === STATE.RUN.SCENARIO.SUCCESS) {
                pluralized = utils.pluralize(storyCount);
                return $translate('RUNNER.REPORTS.MESSAGE.SUCCESS'+pluralized.template,{
                    storyCount: pluralized.value
                });
            } else {
                for (var i=0; i<run.stories.length; i++) {
                    if (run.stories[i].status === STATE.RUN.SCENARIO.SUCCESS) {
                        successStories++;
                    }
                }
                pluralized = utils.pluralize(storyCount);
                return $translate('RUNNER.REPORTS.MESSAGE.FAILED.'+pluralized.template,{
                    successStories: pluralized.value,
                    totalStories: storyCount
                });
            }
        };

        this.list = function(forceReload) {
            if (forceReload || reports === null) {
                reports = [];
                return load(0);
            } else {
                return $q.when(reports);
            }
        };

        this.getReport = function(reportId) {
            if (report !== null && report.id === reportId) {
                return $q.when(report);
            }
            var deferred = $q.defer();
            backend.get('/runs/'+reportId).success(function(reportData) {
                report = reportData;
                runService.setupRunTitle(reportData).then(function(translatedTitle) {
                    report.title = translatedTitle;
                });
                deferred.resolve(report);
            }).error(function() {
                deferred.reject('Failed to load the report with id: '+reportId);
            });
            return deferred.promise;
        };

    }]);
