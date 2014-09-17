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
    .controller('AvailableFilterCtrl', [
        '$scope',
        '$translate',
        '$timeout',
        'EVENTS',
        'MODULES',
        'set',
        'tag',
        function ($scope,$translate,$timeout,EVENTS,MODULES,setService,tagService) {
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
                that.sets = sets;
                evalLoaded();
            });

            tagService.list().then(function (tags) {
                that.tags = tags;
                evalLoaded();
            });

        };

        loadFilter();

    }]);
