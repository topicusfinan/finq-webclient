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
        'config',
        'story',
        'storybookSearch',
        'storyCollapse',
        function ($scope,EVENTS,MODULES,configProvider,storyService,storybookSearchService,storyCollapseService) {
        var that = this;

        this.filter = {
            set: {
                id: 'set',
                key: null
            },
            tag: {
                id: 'tag',
                key: null
            },
            env: {
                id: 'env',
                key: null,
                book: {
                    id: function(bookId) {
                        return 'env.book.'+bookId;
                    }
                }

            }
        };
        this.selectedItem = null;
        this.maxScenarios = configProvider.client().pagination.maxScenarios;
        this.currentPage = 0;

        $scope.storybooks = storyCollapseService.getBooks;
        $scope.expand = storyCollapseService.getExpand;

        // emit the controller updated event immediately after loading to update the page information
        $scope.$emit(EVENTS.PAGE_CONTROLLER_UPDATED,{
            module: MODULES.RUNNER,
            // our default section is the list with available scenarios that can be run
            section: MODULES.RUNNER.sections.AVAILABLE
        });

        storyService.list().then(function(bookList) {
            that.storiesLoaded = true;
            storybookSearchService.initialize(bookList);
            storyCollapseService.initialize(bookList);
        });

        $scope.$on(EVENTS.FILTER_SELECT_UPDATED,function(event,filterInfo) {
            var idSplit = filterInfo.id.split('.');
            if (idSplit.length === 3) {
                that.filter[idSplit[0]][idSplit[1]][[idSplit[2]]] = filterInfo.key;
            } else {
                that.filter[filterInfo.id].key = filterInfo.key;
            }
        });

        this.toggleExpand = function(type,bookId) {
            storyCollapseService.toggleExpand(type,bookId);
        };

        this.expandStory = function(bookId,storyId) {
            var expand = storyCollapseService.getExpand();
            that.selectedItem = 'story'+storyId;
            if (expand === 'all' || expand === 'book'+bookId) {
                return;
            }
            storyCollapseService.expandStory(bookId,storyId);
        };

        this.hasMorePages = function() {
            return storybookSearchService.hasMorePages;
        };

    }]);
