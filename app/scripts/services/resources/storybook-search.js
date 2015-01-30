'use strict';
/*global Bloodhound:false */

/**
 * @ngdoc function
 * @name finqApp.service.story:storybookSearch
 * @description
 * # Storybook search service
 *
 * Makes it possible to execute a search within a list of storybooks. This service
 * should be initialized with the full list of storybooks before any searches can
 * be performed using the `suggest` function.
 *
 */
angular.module('finqApp.service')
    .service('storybookSearch', ['config', function (configProvider) {
        var books,
            searchList = {
                global : {
                    scenarios: []
                },
                books : []
            };

        var setupLists = function() {
            searchList.global.scenarios = [];
            angular.forEach(books, function(book) {
                searchList.books[book.id] = {
                    scenarios: []
                };
                angular.forEach(book.stories, function(story) {
                    angular.forEach(story.scenarios, function(scenario) {
                        searchList.global.scenarios.push({
                            book: book.id,
                            title: scenario.title
                        });
                        searchList.books[book.id].scenarios.push({
                            story: story.id,
                            title: scenario.title
                        });
                    });
                });
            });
        };

        this.initialize = function(storybooks, forceReload) {
            if (books !== undefined && !forceReload) {
                return;
            }
            books = storybooks;
            setupLists();

            searchList.global.engine = new Bloodhound({
                datumTokenizer: function(d) {
                    return Bloodhound.tokenizers.whitespace(d.title);
                },
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                limit: configProvider.client().maxSearchResults,
                local: searchList.global.scenarios
            });
            searchList.global.engine.initialize();
            angular.forEach(books, function(book) {
                searchList.books[book.id].engine = new Bloodhound({
                    datumTokenizer: function(d) {
                        return Bloodhound.tokenizers.whitespace(d.title);
                    },
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    limit: configProvider.client().maxSearchResults,
                    local: searchList.books[book.id].scenarios
                });
                searchList.books[book.id].engine.initialize();
            });
        };

        this.suggest = function(query, bookId) {
            var resultType = bookId === undefined ? 'book' : 'story';
            if (searchList.global.engine === undefined) {
                throw new Error('Storybook search has not been initialized');
            }
            var ids = [];
            var searchEngine = bookId === undefined ? searchList.global.engine : searchList.books[bookId].engine;
            searchEngine.get(query, function(suggestions) {
                angular.forEach(suggestions, function(suggestion) {
                    if (ids.indexOf(suggestion[resultType]) === -1) {
                        ids.push(suggestion[resultType]);
                    }
                });
            });
            return ids;
        };

    }]);
