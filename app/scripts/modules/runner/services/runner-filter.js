'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.service:runnerFilter
 * @description
 * # Runner filter service
 *
 * A service that handles the filtering of running stories and keeps them in a filtered state to avoid
 * unnecessary refiltering by the controller.
 */
angular.module('finqApp.runner.service')
    .service('runnerFilter', [
        '$filter',
        'value',
        'story',
        'storybookSearch',
        '$q',
        function ($filter, valueService, storyService, storybookSearchService, $q) {
            var that = this,
                initialized = false,
                storybookSearchFilter = $filter('storybookSearchFilter'),
                storybookSetFilter = $filter('storybookSetFilter'),
                storybookTagFilter = $filter('storybookTagFilter'),
                storySearchFilter = $filter('storySearchFilter'),
                storySetFilter = $filter('storySetFilter'),
                storyTagFilter = $filter('storyTagFilter'),
                scenarioTagFilter = $filter('scenarioTagFilter'),
                unfilteredBooks = [],
                initializing = false,
                filteredBooks = [],
                lastFilter = {
                    sets: [],
                    tags: []
                };

            this.isInitialized = function () {
                return initialized;
            };
            this.initialize = function () {
                var deferred = $q.defer();
                storyService.list().then(function (storybooks) {
                    unfilteredBooks = storybooks;
                    storybookSearchService.initialize(storybooks);
                    that.applyFilter();
                    deferred.resolve();
                    initializing = false;
                    initialized = true;
                });
                initializing = true;
                return deferred.promise;
            };

            this.applyFilter = function (sets, tags) {
                if (!sets) {
                    sets = lastFilter.sets;
                    tags = lastFilter.tags;
                } else {
                    lastFilter.sets = sets;
                    lastFilter.tags = tags;
                }
                if (!initialized && !initializing) {
                    var deferred = $q.defer();
                    that.initialize().then(function () {
                        deferred.resolve(filteredBooks);
                    });
                    return deferred.promise;
                } else {
                    filteredBooks = storybookSearchFilter(angular.copy(unfilteredBooks), valueService.searchQuery);
                    filteredBooks = storybookSetFilter(filteredBooks, sets);
                    filteredBooks = storybookTagFilter(filteredBooks, tags);
                    angular.forEach(filteredBooks, function (book) {
                        var stories = storySearchFilter(book.stories, valueService.searchQuery, book.id);
                        stories = storySetFilter(stories, sets);
                        stories = storyTagFilter(stories, tags);
                        angular.forEach(stories, function (story) {
                            story.scenarios = scenarioTagFilter(angular.copy(story.scenarios), story.tags, tags);
                        });
                        book.stories = stories;
                    });
                    return $q.when(filteredBooks);
                }
            };

            this.getFilteredStoriesByBook = function (bookId) {
                var storyList = [];
                for (var i = 0; i < filteredBooks.length; i++) {
                    if (bookId === null) {
                        storyList = storyList.concat(filteredBooks[i].stories);
                    } else if (filteredBooks[i].id === bookId) {
                        return filteredBooks[i].stories;
                    }
                }
                return storyList;
            };

            this.getFilteredScenariosByStory = function (storyId) {
                var j;
                for (var i = 0; i < filteredBooks.length; i++) {
                    for (j = 0; j < filteredBooks[i].stories.length; j++) {
                        if (filteredBooks[i].stories[j].id === storyId) {
                            return filteredBooks[i].stories[j].scenarios;
                        }
                    }
                }
                return [];
            };

            this.getFilteredStorybooks = function () {
                if (!initialized && !initializing) {
                    that.initialize();
                    return [];
                }
                return filteredBooks;
            };

            this.getLastFilter = function () {
                return lastFilter;
            };

        }]);
