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
    .service('set', ['backend','$q','$timeout', function (backend,$q,$timeout) {
        var sets = null;
        var load = function() {
            var deferred = $q.defer();
            var setNotice = $timeout(function () {
                deferred.notify('Loading sets is taking too long');
            },5000);
            backend.get('/set/list').success(function(setData) {
                sets = setData;
                deferred.resolve(sets);
            }).error(function() {
                deferred.reject('Loading sets failed');
            }).finally(function() {
                $timeout.cancel(setNotice);
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
