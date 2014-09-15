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
    .service('environment', ['backend','$q','$timeout', function (backend,$q,$timeout) {
        var that = this,
            environments = null;

        this.load = function() {
            var deferred = $q.defer();
            var notice = $timeout(function () {
                deferred.notify('Loading environments is taking too long');
            },5000);
            backend.get('/environment/list').success(function(environmentData) {
                environments = environmentData;
                deferred.resolve(environments);
            }).error(function() {
                deferred.reject('Loading environments failed');
            }).finally(function() {
                $timeout.cancel(notice);
            });
            return deferred.promise;
        };
        this.list = function(forceReload) {
            if (forceReload || environments === null) {
                return that.load();
            } else {
                return $q.when(environments);
            }
        };

        this.getByKey = function(environmentKey) {
            if (environments === null) {
                return null;
            }
            for (var i=0; i<environments.length; i++) {
                if (environments[i].key === environmentKey) {
                    return environments[i];
                }
            }
            return null;
        };
    }]);
