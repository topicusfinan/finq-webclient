'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:environment
 * @description
 * # Environment service
 *
 * Makes it possible to execute CRUD and list operations on the available environments. This will not actually execute
 * actions on the environments themselves, but rather on the configuration of environments in the backend routing.
 */
angular.module('finqApp.service')
    .service('environment', ['backend','$q', function (backend,$q) {
        var environments = null;
        var load = function() {
            var deferred = $q.defer();
            backend.get('/environment/list').success(function(environmentData) {
                environments = environmentData;
                deferred.resolve(environments);
            }).error(function() {
                deferred.reject('Loading environments failed');
            });
            return deferred.promise;
        };
        this.list = function(forceReload) {
            if (forceReload || environments === null) {
                return load();
            } else {
                return $q.when(environments);
            }
        };
    }]);
