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
    .service('run', ['backend','$q',function (backend,$q) {
        var runs = null;

        var load = function() {
            var deferred = $q.defer();
            backend.get('/runs').success(function(runData) {
                runs = runData;
                deferred.resolve(runData);
            }).error(function() {
                deferred.reject('Loading runs failed');
            });
            return deferred.promise;
        };

        this.list = function(forceReload) {
            if (forceReload || runs === null) {
                return load();
            } else {
                return $q.when(runs);
            }
        };

    }]);
