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
        var that = this,
            environments = null;

        this.load = function() {
            var deferred = $q.defer();
            var notice = setTimeout(function () {
                deferred.notify('Loading environments is taking too long');
            },5000);
            backend.get('/environments').success(function(environmentData) {
                environments = environmentData;
                deferred.resolve(environments);
            }).error(function() {
                deferred.reject('Loading environments failed');
            }).finally(function() {
                clearTimeout(notice);
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

        this.getNameById = function(id) {
            if (!environments) {
                return null;
            }
            for (var i=0; i<environments.length; i++) {
                if (environments[i].id === id) {
                    return environments[i].name;
                }
            }
            return null;
        };

    }]);
