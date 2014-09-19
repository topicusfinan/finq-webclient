'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:storyFilter
 * @description
 * # Story filter service
 *
 * Contains all functions for story filtering to use for display and backend
 * communication about collections of scenarios.
 *
 */
angular.module('finqApp.service')
    .service('storyFilter', ['storybookSearch', function (storybookSearchService) {

        this.storySearch = function(stories, query, bookId) {
            var filteredStories = [];
            if (query === '') {
                return stories;
            }
            var storyIds = storybookSearchService.suggest(query, bookId);
            angular.forEach(stories, function(story) {
                if (storyIds.indexOf(story.id) !== -1) {
                    filteredStories.push(story);
                }
            });

            return filteredStories;
        };

        this.storySet = function(stories, setsToInclude) {
            var filteredStories = [];
            if (!setsToInclude.length) {
                return stories;
            }
            angular.forEach(stories, function(story) {
                var include = false;
                angular.forEach(story.sets, function(set) {
                    if (setsToInclude.indexOf(set) > -1) {
                        include = true;
                    }
                });
                if (include) {
                    filteredStories.push(story);
                }
            });

            return filteredStories;
        };

        this.storyTag = function(stories, tagsToInclude) {
            var filteredStories = [];
            if (!tagsToInclude.length) {
                return stories;
            }
            angular.forEach(stories, function(story) {
                var include = false;
                angular.forEach(story.tags, function(tag) {
                    if (tagsToInclude.indexOf(tag) > -1) {
                        include = true;
                    }
                });
                if (include) {
                    filteredStories.push(story);
                }
            });

            return filteredStories;
        };

    }]);
