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
    .service('report', ['backend','$q','STATE','config','run','utils',function (backend,$q,STATE,configProvider,runService,utils) {
        var reports = null;

        var load = function(increment,maxReportsThisRequest) {
            var deferred = $q.defer();
            var reportsPerRequest = configProvider.client().report.pagination.server.reportsPerRequest;
            var maxReports  = configProvider.client().report.pagination.server.maxTotalReports;
            backend.get('/run',{
                status: [
                    STATE.RUN.SCENARIO.SUCCESS,
                    STATE.RUN.SCENARIO.FAILED
                ],
                size: maxReportsThisRequest || reportsPerRequest,
                page: increment
            }).success(function(runData) {
                transformRunsIntoReports(runData.data);
                if (reports.length < maxReports && runData.totalCount > (increment+1)*reportsPerRequest) {
                    load(increment+1).then(function() {
                        deferred.resolve(reports,Math.min(maxReports-reports.length,reportsPerRequest));
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
            reports.push(report);
        };

        this.list = function(forceReload) {
            if (forceReload || reports === null) {
                reports = [];
                return load(0);
            } else {
                return $q.when(reports);
            }
        };

    }]);
