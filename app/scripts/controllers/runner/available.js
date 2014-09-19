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
        'storyRun',
        'storyFilter',
        'environment',
        function ($scope,$translate,$timeout,EVENTS,MODULES,configProvider,storyService,storybookSearchService,storyCollapseService,storyRunService,storyFilterService,environmentService) {
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

        this.run = function(type,id) {
            if (!that.filter.evn.keys.length) {
                // show feedback, environment should be selected
            } else {
                var stories;
                switch (type) {
                    case 'scenario':
                        storyRunService.runScenario(id);
                        break;
                    case 'story':
                        storyRunService.runStory(id);
                        break;
                    case 'book':
                        stories = storyService.listStoriesByBook([id]);
                        stories = storyFilterService.storySearch(stories,storybookSearchService.query,id);
                        stories = storyFilterService.storySet(stories,that.filter.set.keys);
                        stories = storyFilterService.storyTag(stories,that.filter.tag.keys);
                        angular.forEach(stories,function(story) {
                            storyRunService.runStory(story.id);
                        });
                        break;
                    case 'all':
                        stories = storyService.listStoriesByBook();
                        stories = storyFilterService.storySearch(stories,storybookSearchService.query,id);
                        stories = storyFilterService.storySet(stories,that.filter.set.keys);
                        stories = storyFilterService.storyTag(stories,that.filter.tag.keys);
                        angular.forEach(stories,function(story) {
                            storyRunService.runStory(story.id);
                        });
                        break;

                }
            }
        };

    }]);
