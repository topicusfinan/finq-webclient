'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:set
 * @description
 * # Test set service
 *
 * Makes it possible to execute CRUD and list operations on test sets.
 */
angular.module('finqApp.service')
    .service('set', ['host','$q', function (host,$q) {
        var sets = null;
        var load = function() {
            var deferred = $q.defer();
            host.get('/set/list').success(function(setData) {
                sets = setData;
                deferred.resolve(sets);
            }).error(function() {
                deferred.reject('Loading sets failed');
            });
            return deferred.promise;
        };
        this.list = function(forceReload) {
            if (forceReload || sets === null) {
                return load();
            } else {
                return $q.when(sets);
            }
        };
    }]);
