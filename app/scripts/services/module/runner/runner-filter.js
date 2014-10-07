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
        'storyCollapse',
        function ($filter,storyService,storybookSearchService,storyCollapseService) {
        var that = this,
            availableStorybookFilter = $filter('availableStorybookFilter'),
            availableStoryFilter = $filter('availableStoryFilter'),
            scenarioTagFilter = $filter('scenarioTagFilter'),
            unfilteredBooks = [],
            initialized = false,
            filteredBooks = [],
            lastFilter = {
                sets: [],
                tags: []
            };

        this.initialize = function() {
            storyService.list().then(function(bookList) {
                unfilteredBooks = bookList;
                storybookSearchService.initialize(bookList);
                storyCollapseService.initialize(bookList);
                that.applyFilter();
            });
            initialized = true;
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
                that.initialize();
            } else {
                if (!sets) {
                    sets = lastFilter.sets;
                    tags = lastFilter.tags;
                }
                var query = storybookSearchService.query;
                filteredBooks = availableStorybookFilter(unfilteredBooks,query,sets,tags);
                angular.forEach(filteredBooks, function(book) {
                    var stories = availableStoryFilter(book.stories,query,book.id,sets,tags);
                    angular.forEach(stories, function(story) {
                        story.scenarios = scenarioTagFilter(story.scenarios,story.tags,tags);
                    });
                    book.stories = stories;
                });
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
