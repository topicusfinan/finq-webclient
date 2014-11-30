'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:run
 * @description
 * # Run service
 *
 * Makes it possible to execute list operations on runs that are currently executing.
 */
angular.module('finqApp.service')
    .service('run', ['backend','$q','$translate','STATE','config','utils','story',function (backend,$q,$translate,STATE,configProvider,utils,storyService) {
        var runs = null;

        var load = function() {
            var deferred = $q.defer();
            var maxRuns = configProvider.client().run.pagination.server.runsPerRequest;
            backend.get('/run',{
                status: STATE.RUN.SCENARIO.RUNNING,
                size: maxRuns,
                page: 0
            }).success(function(runData) {
                runs = runData.data;
                deferred.resolve(runData.data);
            }).error(function() {
                deferred.reject('Loading runs failed');
            });
            return deferred.promise;
        };

        this.list = function(forceReload) {
            if (forceReload || runs === null) {
                return load();
            } else {
                return $q.when(runs);
            }
        };

        this.setupRunTitle = function(run) {
            var storyCount,
                story,
                title,
                pluralized,
                largestStoryScenarioCount = 0,
                largestStoryIndex = 0,
                deferred = $q.defer();

            for (var i = 0; i<run.stories.length; i++) {
                if (!run.stories[i].title) {
                    story = storyService.findStoryById(run.stories[i].id);
                    if (story === null) {
                        throw new Error('Storyservice has not loaded any stories yet');
                    }
                    run.stories[i].title = story.title;
                }
                if (run.stories[i].scenarios.length > largestStoryScenarioCount) {
                    largestStoryScenarioCount = run.stories[i].scenarios.length;
                    largestStoryIndex = i;
                }
            }

            title = run.stories[largestStoryIndex].title;
            storyCount = run.stories.length;
            if (storyCount > 1) {
                pluralized = utils.pluralize('RUNNER.RUNNING.RUN.MULTIPLE_STORIES_APPEND', 1, storyCount-1);
                $translate(pluralized.template,{
                    storyCount: pluralized.value
                }).then(function (translatedValue) {
                    title += translatedValue;
                    deferred.resolve(title);
                });
            } else {
                $translate('RUNNER.RUNNING.RUN.SINGLE_STORY_APPEND').then(function (translatedValue) {
                    title += translatedValue;
                    deferred.resolve(title);
                });
            }
            run.title = title;
            return deferred.promise;
        };

    }]);
