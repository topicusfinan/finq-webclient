'use strict';

/**
 * @ngdoc function
 * @name finqApp.filter:storyBookTag
 * @description
 * # Storybook tag filter
 *
 * Allows the filtering of story books by supplying the a certain tag. Only books with stories that are linked
 * to the supplied tag will remain.
 */
angular.module('finqApp.filter')
    .filter('storybookTag', function() {
        return function(books, tagToInclude) {
            var filteredBooks = [];
            if (tagToInclude === null) {
                return books;
            }
            angular.forEach(books, function(book) {
                var include = false;
                angular.forEach(book.stories, function(story) {
                    angular.forEach(story.tags, function(tag) {
                        if (tag === tagToInclude) {
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
