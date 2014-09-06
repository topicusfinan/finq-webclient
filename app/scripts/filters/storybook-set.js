'use strict';

/**
 * @ngdoc function
 * @name finqApp.filter:storyBookSetFilter
 * @description
 * # Storybook set filter
 *
 * Allows the filtering of story books by supplying the a certain set. Only books with stories that are linked
 * to the supplied set will remain.
 */
angular.module('finqApp.filter')
    .filter('storybookSetFilter', function() {
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
