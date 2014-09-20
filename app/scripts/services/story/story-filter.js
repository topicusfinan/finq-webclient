'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:storyFilter
 * @description
 * # Story filter service
 *
 * Contains all functions for story filtering to use for display and backend
 * communication about collections of scenarios.
 *
 */
angular.module('finqApp.service')
    .service('storyFilter', ['storybookSearch', function (storybookSearchService) {

        this.storySearch = function(stories, query, bookId) {
            var filteredStories = [];
            if (query === '') {
                return stories;
            }
            var storyIds = storybookSearchService.suggest(query, bookId);
            angular.forEach(stories, function(story) {
                if (storyIds.indexOf(story.id) !== -1) {
                    filteredStories.push(story);
                }
            });

            return filteredStories;
        };

        this.storySet = function(stories, setsToInclude) {
            var filteredStories = [];
            if (!setsToInclude.length) {
                return stories;
            }
            angular.forEach(stories, function(story) {
                var include = false;
                angular.forEach(story.sets, function(set) {
                    if (setsToInclude.indexOf(set) > -1) {
                        include = true;
                    }
                });
                if (include) {
                    filteredStories.push(story);
                }
            });

            return filteredStories;
        };

        this.storyTag = function(stories, tagsToInclude) {
            var filteredStories = [],
                i, j, k;
            if (!tagsToInclude.length) {
                return stories;
            }
            for (i=0; i<stories.length; i++) {
                var include = false;
                for (j=0; j<stories[i].tags.length; j++) {
                    if (tagsToInclude.indexOf(stories[i].tags[j]) > -1) {
                        include = true;
                        break;
                    }
                }
                if (!include) {
                    for (j=0; j<stories[i].scenarios.length; j++) {
                        for (k=0; k<stories[i].scenarios[j].tags.length; k++) {
                            if (tagsToInclude.indexOf(stories[i].scenarios[j].tags[k]) > -1) {
                                include = true;
                                break;
                            }
                        }
                        if (include) {
                            break;
                        }
                    }
                }
                if (include) {
                    filteredStories.push(stories[i]);
                }
            }

            return filteredStories;
        };

        this.scenarioTag = function(scenarios, storyTags, tagsToInclude) {
            var filteredScenarios = [],
                i, j;
            if (!tagsToInclude.length) {
                return scenarios;
            }
            for (i=0; i<storyTags.length; i++) {
                if (tagsToInclude.indexOf(storyTags[i]) > -1) {
                    return scenarios;
                }
            }
            for (i=0; i<scenarios.length; i++) {
                for (j=0; j<scenarios[i].tags.length; j++) {
                    if (tagsToInclude.indexOf(scenarios[i].tags[j]) > -1) {
                        filteredScenarios.push(scenarios[i]);
                        break;
                    }
                }
            }

            return filteredScenarios;
        };

    }]);
