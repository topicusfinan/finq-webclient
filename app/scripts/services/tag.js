'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:tag
 * @description
 * # Tag service
 *
 * Makes it possible to execute CRUD and list operations on tags.
 */
angular.module('finqApp.service')
    .service('tag', ['backend','$q','$timeout', function (backend,$q,$timeout) {
        var tags = null;
        var load = function() {
            var deferred = $q.defer();
            var tagNotice = $timeout(function () {
                deferred.notify('Loading tags is taking too long');
            },5000);
            backend.get('/tag/list').success(function(tagData) {
                tags = tagData;
                deferred.resolve(tags);
            }).error(function() {
                deferred.reject('Loading tags failed');
            }).finally(function() {
                $timeout.cancel(tagNotice);
            });
            return deferred.promise;
        };
        this.list = function(forceReload) {
            if (forceReload || tags === null) {
                return load();
            } else {
                return $q.when(tags);
            }
        };
    }]);
