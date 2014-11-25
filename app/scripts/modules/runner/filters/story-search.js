'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.filter:storySearchFilter
 * @description
 * # Story search filter
 *
 * Allows for filtering using custom search queries. This uses the bloodhound engine to
 * search using keywords. It limits the search to the title of scenarios and will not query
 * the title of steps.
 *
 * This filter assumes that the storySearchService has has been initialized with the booklist
 * to use.
 */
angular.module('finqApp.runner.filter')
    .filter('storySearchFilter', ['storybookSearch', function(storybookSearchService) {
        return function(stories, query, bookId) {
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
    }]);
