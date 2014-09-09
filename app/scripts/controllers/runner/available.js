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
        'story',
        'storybookSearch',
        'storyCollapse',
        function ($scope,EVENTS,MODULES,storyService,storybookSearchService,storyCollapseService) {
        var that = this;

        this.setFilterId = 'set';
        this.tagFilterId = 'tag';
        this.filterKeys = {
            tag: null,
            set: null
        };
        this.selectedItem = null;

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
            that.filterKeys[filterInfo.id] = filterInfo.key;
        });

        this.toggleExpand = function(type,bookId) {
            storyCollapseService.toggleExpand(type,bookId);
        };

        this.expandStory = function(bookId,storyId) {
            if (that.expand === 'all' || that.expand === 'book'+bookId) {
                that.selectedItem = 'story'+storyId;
                return;
            }
            that.selectedItem = 'story'+storyId;
            storyCollapseService.expandStory(bookId,storyId);
        };

    }]);
