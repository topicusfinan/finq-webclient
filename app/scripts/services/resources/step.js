'use strict';

angular.module('finqApp.service')
    .service('step', function (backend,$q) {
        var steps = null;

        var load = function() {
            var deferred = $q.defer();
            backend.get('/steps').success(function(stepData) {
                steps = stepData;
                deferred.resolve(steps);
            }).error(function() {
                deferred.reject('Loading steps failed');
            });
            return deferred.promise;
        };

        this.list = function(forceReload) {
            if (forceReload || steps === null) {
                return load();
            } else {
                return $q.when(steps);
            }
        };
    });
