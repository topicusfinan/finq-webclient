'use strict';

/**
 * @ngdoc overview
 * @name finqApp.service.story:StoryCollapse
 * @description
 * # Story collapse support service
 *
 * A supporting services that initializes interaction with a storybook tree hierarchy, allowing the user to
 * expand and collapse items in the story tree.
 */
angular.module('finqApp.service')
    .factory('storyCollapse', function () {
        var storybooks = [],
            expand = null,
            expandedStories = {};

        var collapseBook = function(books,bookId) {
            angular.forEach(storybooks,function(book) {
                if (book.id === bookId || bookId === undefined) {
                    delete expandedStories['book'+book.id];
                    angular.forEach(book.stories,function(story) {
                        story.expand = false;
                    });
                }
            });
        };

        return {
            initialize: function (books) {
                storybooks = books;
            },

            getBooks: function () {
                return storybooks;
            },

            getExpand: function () {
                return expand;
            },

            toggleExpand: function (type, bookId) {
                var newExpand = type === 'all' ? 'all' : type + bookId;
                if (expand === newExpand) {
                    expand = null;
                } else {
                    if (type === 'book') {
                        if (expandedStories['book' + bookId]) {
                            collapseBook(bookId);
                            return;
                        }
                    } else {
                        if (Object.keys(expandedStories).length) {
                            collapseBook();
                            expand = null;
                            return;
                        }
                    }
                    expand = newExpand;
                }
                return expand;
            },

            expandStory: function (bookId, storyId) {
                var bookIndex,
                    storyIndex;
                angular.forEach(storybooks, function (book, index) {
                    if (book.id === bookId) {
                        bookIndex = index;
                        angular.forEach(book.stories, function (story, index) {
                            if (story.id === storyId) {
                                storyIndex = index;
                            }
                        });
                    }
                });
                if (bookIndex !== undefined && storyIndex !== undefined) {
                    expandedStories['book' + bookId] = true;
                    storybooks[bookIndex].stories[storyIndex].expand = true;
                }
            }
        };

    });
