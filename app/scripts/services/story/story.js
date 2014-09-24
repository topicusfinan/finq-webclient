'use strict';

/**
 * @ngdoc function
 * @name finqApp.service.story:story
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
            angular.forEach(storybooks, function(book) {
                if (bookIds === null || bookIds.indexOf(book.id) > -1) {
                    stories = stories.concat(book.stories);
                }
            });
            return stories;
        };

        this.findStoryById = function(storyId) {
            var i, j;
            for (i=0; i<storybooks.length; i++) {
                for (j=0; j<storybooks[i].stories.length; j++) {
                    if (storybooks[i].stories[j].id === storyId) {
                        return storybooks[i].stories[j];
                    }
                }
            }
            return null;
        };

        this.findScenarioById = function(scenarioId) {
            var i, j, k;
            for (i=0; i<storybooks.length; i++) {
                for (j=0; j<storybooks[i].stories.length; j++) {
                    for (k=0; k<storybooks[i].stories[j].scenarios.length; k++) {
                        if (storybooks[i].stories[j].scenarios[k].id === scenarioId) {
                            return storybooks[i].stories[j].scenarios[k];
                        }
                    }
                }
            }
            return null;
        };
    }]);
