'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:run
 * @description
 * # Run service
 *
 * Makes it possible to execute list operations on runs that are currently executing.
 */
angular.module('finqApp.service')
    .service('run', ['backend','$q','STATE',function (backend,$q,STATE) {
        var runs = {
            running: null,
            reports: null
        };

        var load = function(targetList,statusses) {
            var deferred = $q.defer();
            backend.get('/run',{
                status: statusses
            }).success(function(runData) {
                runs[targetList] = runData.data;
                deferred.resolve(runData.data);
            }).error(function() {
                deferred.reject('Loading runs failed');
            });
            return deferred.promise;
        };

        this.listRunningStories = function(forceReload) {
            if (forceReload || runs.running === null) {
                return load('running',STATE.RUN.SCENARIO.RUNNING);
            } else {
                return $q.when(runs.running);
            }
        };

        this.listReports = function(forceReload) {
            if (forceReload || runs.reports === null) {
                return load('reports',[STATE.RUN.SCENARIO.SUCCESS,STATE.RUN.SCENARIO.FAILED]);
            } else {
                return $q.when(runs.reports);
            }
        };

    }]);
