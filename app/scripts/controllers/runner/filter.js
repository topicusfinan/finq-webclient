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
                setupEmptySetList();
                that.sets.list = that.sets.list.concat(sets);
                evalLoaded();
            });

            tagService.list().then(function (tags) {
                setupEmptyTagList();
                that.tags.list = that.tags.list.concat(tags);
                evalLoaded();
            });

        };

        var setupEmptySetList = function() {
            that.sets = {
                active: {
                    key: null,
                    value: ''
                },
                list: [{key: null, value: ''}]
            };
            $translate('FILTERS.SETS.DEFAULT_VALUE').then(function (translatedValue) {
                that.sets.active.value = translatedValue;
                that.sets.list[0].value = translatedValue;
            });
        };

        var setupEmptyTagList = function() {
            that.tags = {
                active: {
                    key: null,
                    value: ''
                },
                list: [{key: null, value: ''}]
            };
            $translate('FILTERS.TAGS.DEFAULT_VALUE').then(function (translatedValue) {
                that.tags.active.value = translatedValue;
                that.tags.list[0].value = translatedValue;
            });
        };

        loadFilter();

    }]);
