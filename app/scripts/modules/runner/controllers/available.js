'use strict';
/**
 * @ngdoc overview
 * @name finqApp.runner.controller:AvailableCtrl
 * @description
 * # Available scenarios Controller
 *
 * The available controller allows a user to execute tests. It provides lists of available tests that can
 * be run, and provides the user with the ability to execute a particular test. Such a test can
 * either be run in the background or in debug mode.
 */
angular.module('finqApp.runner.controller')
    .controller('AvailableCtrl', function ($scope, $timeout, $filter, EVENTS, FEEDBACK, MODULES, $config, $value, $feedback, $module, $runnerFilter, $story, $storybookSearch, $runExecution, $environment) {
        var that = this;

        this.filter = {
            set: {id: 'set', ids: []},
            tag: {id: 'tag', ids: []},
            env: {id: 'env', ids: []}
        };
        this.searchQuery = '';
        this.storyListRef = 'stories';
        this.envPlaceholder = 'FILTERS.ENVIRONMENTS.NONE';
        this.selectedItem = null;
        this.maxScenarios = $config.client().available.pagination.client.scenariosPerPage;
        this.maxSelectItems = $config.client().selectDropdown.pagination.itemsPerPage;
        this.currentPage = 0;
        this.hasMorePages = $value.hasMorePages;

        $scope.storybooks = $runnerFilter.getFilteredStorybooks;
        $scope.initialized = $runnerFilter.isInitialized;

        $scope.$on(EVENTS.SCOPE.FILTER_SELECT_UPDATED, function (event, filterInfo) {
            that.filter[filterInfo.id].ids = filterInfo.keys;
            $runnerFilter.applyFilter(that.filter.set.ids, that.filter.tag.ids, that.searchQuery);
        });

        $scope.$on(EVENTS.SCOPE.SEARCH_UPDATED, function (event, query) {
            that.searchQuery = query;
            $runnerFilter.applyFilter(that.filter.set.ids, that.filter.tag.ids, that.searchQuery);
        });

        $module.setCurrentSection(MODULES.RUNNER.sections.AVAILABLE);

        $environment.list().then(function (environments) {
            that.environments = [];
            angular.forEach(environments, function (environment) {
                that.environments.push({
                    key: environment.id,
                    value: environment.name
                });
            });
        });

        this.run = function (type, id) {
            var story,
                scenarios,
                i, j;

            var runByBook = function (bookId) {
                var stories = $runnerFilter.getFilteredStoriesByBook(bookId === null ? null : bookId);
                var runStories = [];
                for (i = 0; i < stories.length; i++) {
                    var runScenarios = [];
                    for (j = 0; j < stories[i].scenarios.length; j++) {
                        runScenarios.push(stories[i].scenarios[j].id);
                    }
                    runStories.push({
                        id: stories[i].id,
                        scenarios: runScenarios
                    });
                }
                $runExecution.runStories(runStories, that.filter.env.ids[0]);
            };

            if (!that.filter.env.ids.length) {
                $feedback.error(FEEDBACK.ERROR.RUN.NO_ENVIRONMENT_SELECTED);
            } else {
                switch (type) {
                    case 'scenario':
                        story = $story.findStoryByScenarioId(id);
                        $runExecution.runStory({
                            id: story.id,
                            scenarios: [id]
                        }, that.filter.env.ids[0]);
                        break;
                    case 'story':
                        scenarios = $runnerFilter.getFilteredScenariosByStory(id);
                        var runScenarios = [];
                        for (i = 0; i < scenarios.length; i++) {
                            runScenarios.push(scenarios[i].id);
                        }
                        $runExecution.runStory({
                            id: id,
                            scenarios: runScenarios
                        }, that.filter.env.ids[0]);
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

    });
