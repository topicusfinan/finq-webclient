'use strict';

/**
 * @ngdoc function
 * @name finqApp.service.module:runner
 * @description
 * # Runner module service
 *
 * A service dedicated to the runner module, allowing this module to respond to related
 * events, and provide information on the runner module to other services and controllers.
 */
angular.module('finqApp.service')
    .service('runnerFilter', [
        '$filter',
        'story',
        'storybookSearch',
        '$q',
        function ($filter,storyService,storybookSearchService,$q) {
        var that = this,
            storybookSearchFilter = $filter('storybookSearchFilter'),
            storybookSetFilter = $filter('storybookSetFilter'),
            storybookTagFilter = $filter('storybookTagFilter'),
            storySearchFilter = $filter('storySearchFilter'),
            storySetFilter = $filter('storySetFilter'),
            storyTagFilter = $filter('storyTagFilter'),
            scenarioTagFilter = $filter('scenarioTagFilter'),
            unfilteredBooks = [],
            initialized = false,
            filteredBooks = [],
            lastFilter = {
                sets: [],
                tags: []
            };

        this.initialize = function() {
            var deferred = $q.defer();
            storyService.list().then(function(bookList) {
                unfilteredBooks = bookList;
                storybookSearchService.initialize(bookList);
                that.applyFilter();
                deferred.resolve();
            });
            initialized = true;
            return deferred.promise;
        };

        this.applyFilter = function(sets,tags) {
            if (!sets) {
                sets = lastFilter.sets;
                tags = lastFilter.tags;
            } else {
                lastFilter.sets = sets;
                lastFilter.tags = tags;
            }
            if (!initialized) {
                var deferred = $q.defer();
                that.initialize().then(function() {
                    deferred.resolve(filteredBooks);
                });
                return deferred.promise;
            } else {
                var query = storybookSearchService.query;
                filteredBooks = storybookSearchFilter(angular.copy(unfilteredBooks),query);
                filteredBooks = storybookSetFilter(filteredBooks,sets);
                filteredBooks = storybookTagFilter(filteredBooks,tags);
                angular.forEach(filteredBooks, function(book) {
                    var stories = storySearchFilter(book.stories,query,book.id);
                    stories = storySetFilter(stories,sets);
                    stories = storyTagFilter(stories,tags);
                    angular.forEach(stories, function(story) {
                        story.scenarios = scenarioTagFilter(angular.copy(story.scenarios),story.tags,tags);
                    });
                    book.stories = stories;
                });
                return $q.when(filteredBooks);
            }
        };

        this.getFilteredStoriesByBook = function(bookId) {
            var storyList = [];
            for (var i=0; i<filteredBooks.length; i++) {
                if (bookId === null) {
                    storyList = storyList.concat(filteredBooks[i].stories);
                } else if (filteredBooks[i].id === bookId) {
                    return filteredBooks[i].stories;
                }
            }
            return storyList;
        };

        this.getFilteredScenariosByStory = function(storyId) {
            var j;
            for (var i=0; i<filteredBooks.length; i++) {
                for (j=0; j<filteredBooks[i].stories.length; j++) {
                    if (filteredBooks[i].stories[j].id === storyId) {
                        return filteredBooks[i].stories[j].scenarios;
                    }
                }
            }
            return [];
        };

        this.getFilteredStorybooks = function() {
            if (!initialized) {
                that.initialize();
                return [];
            }
            return filteredBooks;
        };

    }]);
