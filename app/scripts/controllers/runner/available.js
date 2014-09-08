'use strict';

/**
 * @ngdoc overview
 * @name finqApp.controller:AvailableCtrl
 * @description
 * # Available scenarios Controller
 *
 * The available controller allows a user to execute tests. It provides lists of available tests that can
 * be run, and provides the user with the ability to execute a particular test. Such a test can
 * either be run in the background or in debug mode.
 */
angular.module('finqApp.controller')
    .controller('AvailableCtrl', [
        '$scope',
        'EVENTS',
        'MODULES',
        'FILTER_SELECT_EVENTS',
        'story',
        'storybookSearch',
        function ($scope,EVENTS,MODULES,FILTER_SELECT_EVENTS,storyService,storybookSearchService) {
        var that = this,
            expandedStories = {};

        this.storybooks = [];
        this.setFilterId = 'set';
        this.tagFilterId = 'tag';
        this.filterKeys = {
            tag: null,
            set: null
        };
        this.selectedItem = null;
        this.expand = null;
        this.selectedScenarios = [];

        // emit the controller updated event immediately after loading to update the page information
        $scope.$emit(EVENTS.PAGE_CONTROLLER_UPDATED,{
            module: MODULES.RUNNER,
            // our default section is the list with available scenarios that can be run
            section: MODULES.RUNNER.sections.AVAILABLE
        });

        storyService.list().then(function(bookList) {
            that.storybooks = bookList;
            that.storiesLoaded = true;
            storybookSearchService.initialize(bookList);
        });

        $scope.$on(FILTER_SELECT_EVENTS.UPDATED,function(event,filterInfo) {
            that.filterKeys[filterInfo.id] = filterInfo.key;
        });

        this.toggleExpand = function(type,bookId) {
            var expand = type === 'all' ? 'all' : type+bookId;
            if (that.expand === expand) {
                that.expand = null;
            } else {
                if (type === 'book') {
                    if (expandedStories['book'+bookId]) {
                        collapseBook(bookId);
                        return;
                    }
                } else {
                    if (Object.keys(expandedStories).length) {
                        collapseBook();
                    }
                }
                that.expand = expand;
            }
        };

        this.expandStory = function(bookId,storyId) {
            if (that.expand === 'all' || that.expand === 'book'+bookId) {
                that.selectedItem = 'story'+storyId;
                return;
            }
            that.selectedItem = 'story'+storyId;
            var bookIndex,
                storyIndex;
            angular.forEach(that.storybooks,function(book, index) {
                if (book.id === bookId) {
                    bookIndex = index;
                    angular.forEach(book.stories,function(story, index) {
                        if (story.id === storyId) {
                            storyIndex = index;
                        }
                    });
                }
            });
            if (bookIndex !== undefined && storyIndex !== undefined) {
                expandedStories['book'+bookId] = true;
                that.storybooks[bookIndex].stories[storyIndex].expand = true;
            }
        };

        var collapseBook = function(bookId) {
            angular.forEach(that.storybooks,function(book) {
                if (book.id === bookId || bookId === undefined) {
                    delete expandedStories['book'+bookId];
                    angular.forEach(book.stories,function(story) {
                        story.expand = false;
                    });
                }
            });
        };

    }]);
