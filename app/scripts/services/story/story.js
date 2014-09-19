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
        var storybooks = null;

        var load = function() {
            var deferred = $q.defer();
            backend.get('/story/list').success(function(storyData) {
                storybooks = storyData;
                deferred.resolve(storybooks);
            }).error(function() {
                deferred.reject('Loading storybooks failed');
            });
            return deferred.promise;
        };

        this.list = function(forceReload) {
            if (forceReload || storybooks === null) {
                return load();
            } else {
                return $q.when(storybooks);
            }
        };

        this.listStoriesByBook = function(bookIds) {
            var stories = [];
            angular.forEach(storybooks,function(book) {
                if (bookIds === undefined || bookIds.indexOf(book.id) > -1) {
                    stories = stories.concat(book.stories);
                }
            });
            return stories;
        };
    }]);
