'use strict';

/**
 * @ngdoc function
 * @name finqApp.runner.filter:storyBookTagFilter
 * @description
 * # Storybook tag filter
 *
 * Allows the filtering of story books by supplying a list of tags. Only books with stories that are linked
 * to the supplied tags will remain.
 */
angular.module('finqApp.runner.filter')
    .filter('storybookTagFilter', function () {
        return function (books, tagsToInclude) {
            var filteredBooks = [],
                i, j, k, l;
            if (!tagsToInclude.length) {
                return books;
            }
            for (i = 0; i < books.length; i++) {
                var include = false;
                for (j = 0; j < books[i].stories.length; j++) {
                    for (k = 0; k < books[i].stories[j].tags.length; k++) {
                        if (tagsToInclude.indexOf(books[i].stories[j].tags[k].id) > -1) {
                            include = true;
                            break;
                        }
                    }
                    if (!include) {
                        for (k = 0; k < books[i].stories[j].scenarios.length; k++) {
                            for (l = 0; l < books[i].stories[j].scenarios[k].tags.length; l++) {
                                if (tagsToInclude.indexOf(books[i].stories[j].scenarios[k].tags[l].id) > -1) {
                                    include = true;
                                    break;
                                }
                            }
                            if (include) {
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
                if (include) {
                    filteredBooks.push(books[i]);
                }
            }

            return filteredBooks;
        };
    });
