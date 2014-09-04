'use strict';

/**
 * @ngdoc function
 * @name finqApp.filter:storyBookSet
 * @description
 * # Story set filter
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
                var include = false;
                angular.forEach(book.stories, function(story) {
                    angular.forEach(story.sets, function(set) {
                        if (set === setToInclude) {
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
