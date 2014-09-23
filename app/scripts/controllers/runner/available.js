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
        '$timeout',
        '$filter',
        'EVENTS',
        'FEEDBACK',
        'MODULES',
        'config',
        'feedback',
        'sectionState',
        'story',
        'storybookSearch',
        'storyCollapse',
        'storyRun',
        'environment',
        function ($scope,$timeout,$filter,EVENTS,FEEDBACK,MODULES,configProvider,feedbackService,sectionStateService,storyService,storybookSearchService,storyCollapseService,storyRunService,environmentService) {
        var that = this,
            availableStoryFilter = $filter('availableStoryFilter'),
            scenarioTagFilter = $filter('scenarioTagFilter');

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
        this.maxSelectItems = configProvider.client().pagination.maxSelectDropdownItems;
        this.currentPage = 0;

        $scope.storybooks = storyCollapseService.getBooks;
        $scope.expand = storyCollapseService.getExpand;

        $scope.$on(EVENTS.SCOPE.FILTER_SELECT_UPDATED,function(event,filterInfo) {
            that.filter[filterInfo.id].keys = filterInfo.keys;
        });

        sectionStateService.setCurrentSection(MODULES.RUNNER.sections.AVAILABLE);

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
            var story,
                scenarios,
                scenarioIds = [],
                i, j;

            var runByBook = function(bookId) {
                var stories = storyService.listStoriesByBook(bookId === null ? null : [bookId]);
                stories = availableStoryFilter(stories,storybookSearchService.query,id,that.filter.set.keys,that.filter.tag.keys);
                for (i=0; i<stories.length; i++) {
                    scenarios = scenarioTagFilter(stories[i].scenarios,stories[i].tags,that.filter.tag.keys);
                    for (j=0; j<scenarios.length; j++) {
                        scenarioIds.push(scenarios[j].id);
                    }
                }
                storyRunService.runScenarios(scenarioIds);
            };

            if (!that.filter.env.keys.length) {
                feedbackService.error(FEEDBACK.ERROR.RUN.NO_ENVIRONMENT_SELECTED);
            } else {
                switch (type) {
                    case 'scenario':
                        storyRunService.runScenario(id);
                        break;
                    case 'story':
                        story = storyService.findStoryById(id);
                        scenarios = scenarioTagFilter(story.scenarios,story.tags,that.filter.tag.keys);
                        for (i=0; i<scenarios.length; i++) {
                            scenarioIds.push(scenarios[i].id);
                        }
                        storyRunService.runScenarios(scenarioIds);
                        break;
                    case 'book':
                        runByBook(id);
                        break;
                    case 'all':
                        runByBook(null);
                        break;

                }
            }
        };

    }]);
