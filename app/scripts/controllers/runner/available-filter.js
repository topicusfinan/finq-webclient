'use strict';

/**
 * @ngdoc overview
 * @name finqApp.controller:AvailableFilterCtrl
 * @description
 * # Available filter Controller
 *
 * This filter allows the filtering of stories, storybooks and scenarios based on a list of properties
 * within the available story section.
 */
angular.module('finqApp.controller')
    .controller('AvailableFilterCtrl', ['set','tag',function (setService,tagService) {
        var that = this;

        this.expand = {
            set: true,
            tag: false
        };
        this.tagPlaceholder = 'FILTERS.TAGS.DEFAULT_VALUE';
        this.setPlaceholder = 'FILTERS.SETS.DEFAULT_VALUE';

        var loadFilter = function() {
            var stepsLoaded = 0,
                totalSteps = 2;

            var evalLoaded = function() {
                stepsLoaded++;
                if (totalSteps === stepsLoaded) {
                    that.loaded = true;
                }
            };

            setService.list().then(function (sets) {
                that.sets = [];
                angular.forEach(sets, function(set) {
                    that.sets.push({
                        key: set.id,
                        value: set.name
                    });
                });
                evalLoaded();
            });

            tagService.list().then(function (tags) {
                that.tags = [];
                angular.forEach(tags, function(tag) {
                    that.tags.push({
                        key: tag.id,
                        value: tag.value
                    });
                });
                evalLoaded();
            });

        };

        loadFilter();

    }]);
