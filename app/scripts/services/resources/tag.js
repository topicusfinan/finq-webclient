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
    .service('tag', function (backend,$q) {
        var tags = null;
        var load = function() {
            var deferred = $q.defer();
            backend.get('/tags').success(function(tagData) {
                tags = tagData;
                deferred.resolve(tags);
            }).error(function() {
                deferred.reject('Loading tags failed');
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
    });
