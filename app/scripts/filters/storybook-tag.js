'use strict';

/**
 * @ngdoc function
 * @name finqApp.filter:storyBookTagFilter
 * @description
 * # Storybook tag filter
 *
 * Allows the filtering of story books by supplying the a certain tag. Only books with stories that are linked
 * to the supplied tag will remain.
 */
angular.module('finqApp.filter')
    .filter('storybookTagFilter', function() {
        return function(books, tagsToInclude) {
            var filteredBooks = [];
            if (!tagsToInclude.length) {
                return books;
            }
            angular.forEach(books, function(book) {
                var include = false;
                angular.forEach(book.stories, function(story) {
                    angular.forEach(story.tags, function(tag) {
                        if (tagsToInclude.indexOf(tag) > -1) {
                            include = true;
                        }
                    });
                });
                if (include) {
                    filteredBooks.push(book);
                }
            });

            return filteredBooks;
        };
    });
