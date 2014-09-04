'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:story
 * @description
 * # Story service
 *
 * Makes it possible to execute CRUD and list operations on stories.
 */
angular.module('finqApp.service')
    .service('story', ['backend','$q',function (backend,$q) {
        var stories = null;
        var load = function() {
            var deferred = $q.defer();
            backend.get('/story/list').success(function(storyData) {
                stories = storyData;
                deferred.resolve(stories);
            }).error(function() {
                deferred.reject('Loading stories failed');
            });
            return deferred.promise;
        };
        this.list = function(forceReload) {
            if (forceReload || stories === null) {
                return load();
            } else {
                return $q.when(stories);
            }
        };
    }]);
