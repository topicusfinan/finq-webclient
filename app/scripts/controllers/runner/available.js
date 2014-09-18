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
        '$translate',
        '$timeout',
        'EVENTS',
        'MODULES',
        'config',
        'story',
        'storybookSearch',
        'storyCollapse',
        'environment',
        function ($scope,$translate,$timeout,EVENTS,MODULES,configProvider,storyService,storybookSearchService,storyCollapseService,environmentService) {
        var that = this;

        this.filter = {
            set: {
                id: 'set',
                keys: []
            },
            tag: {
                id: 'tag',
                keys: []
            },
            env: {
                id: 'env',
                keys: []
            }
        };
        this.storyListRef = 'stories';
        that.envPlaceholder = 'FILTERS.ENVIRONMENTS.DEFAULT_VALUE';
        this.envSyncEvent = EVENTS.SYNCHRONIZE_ENVIRONMENTS;
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

        $scope.$on(EVENTS.FILTER_SELECT_UPDATED,function(event,filterInfo) {
            that.filter[filterInfo.id].keys = filterInfo.keys;
            if (filterInfo.id === 'env') {
                $scope.$broadcast(that.envSyncEvent,filterInfo.keys);
            }
        });

        environmentService.list().then(function (environments) {
            that.environments = environments;
        });

        storyService.list().then(function(bookList) {
            that.storiesLoaded = true;
            storybookSearchService.initialize(bookList);
            storyCollapseService.initialize(bookList);
        });

        // delay the loaded indication to allow for appear effects
        $timeout(function() {
            that.loaded = true;
        },10);

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
