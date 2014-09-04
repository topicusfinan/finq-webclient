'use strict';

/**
 * @ngdoc function
 * @name finqApp.filter:storySet
 * @description
 * # Storybook set filter
 *
 * Allows the filtering of story books by supplying the a certain set. Only books with stories that are linked
 * to the supplied set will remain, and only the stories in that book that are linked will be in the result.
 */
angular.module('finqApp.filter')
    .filter('storyBookSet', function() {
        return function(books, setToInclude) {
            var filteredBooks = [];
            if (setToInclude === null) {
                return books;
            }
            angular.forEach(books, function(book) {
                var filteredStories = [];
                angular.forEach(book.stories, function(story) {
                    angular.forEach(story.sets, function(set) {
                        if (set === setToInclude) {
                            filteredStories.push(story);
                        }
                    });
                });
                if (filteredStories.length !== 0) {
                    filteredBooks.push(book);
                    filteredBooks[filteredBooks.length-1].stories = filteredStories;
                }
            });
            return filteredBooks;
        };
    });
