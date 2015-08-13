'use strict';

/**
 * @ngdoc overview
 * @name finqApp.runner.controller:AvailableFilterCtrl
 * @description
 * # Available filter Controller
 *
 * This filter allows the filtering of stories, storybooks and scenarios based on a list of properties
 * within the available story section.
 */
angular.module('finqApp.runner.controller')
    .controller('AvailableFilterCtrl', function ($set, $tag, $runnerFilter) {
        var that = this,
            currentActiveFilter = $runnerFilter.getLastFilter();

        this.expand = {
            set: true,
            tag: currentActiveFilter.tags.length > 0
        };
        this.tagPlaceholder = 'FILTERS.TAGS.ANY';
        this.setPlaceholder = 'FILTERS.SETS.ANY';

        var loadFilter = function () {
            var stepsLoaded = 0,
                totalSteps = 2;

            var evalLoaded = function () {
                stepsLoaded++;
                if (totalSteps === stepsLoaded) {
                    that.loaded = true;
                }
            };

            $set.list().then(function (sets) {
                that.sets = [];
                angular.forEach(sets, function (set) {
                    that.sets.push({
                        key: set.id,
                        value: set.name
                    });
                });
                that.setsDefault = currentActiveFilter.sets.length ? currentActiveFilter.sets.join(',') : undefined;
                evalLoaded();
            });

            $tag.list().then(function (tags) {
                that.tags = [];
                angular.forEach(tags, function (tag) {
                    that.tags.push({
                        key: tag.id,
                        value: tag.value
                    });
                });
                that.tagsDefault = currentActiveFilter.tags.length ? currentActiveFilter.tags.join(',') : undefined;
                evalLoaded();
            });

        };

        loadFilter();

    });
