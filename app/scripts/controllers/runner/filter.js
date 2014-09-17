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
        'environment',
        'host',
        function ($scope,$translate,$timeout,EVENTS,MODULES,setService,tagService,environmentService,hostProvider) {
        var that = this;

        this.expand = {
            env: true,
            set: false,
            tag: false
        };

        var loadFilter = function() {
            var stepsLoaded = 0,
                totalSteps = 3;

            var evalLoaded = function() {
                stepsLoaded++;
                if (totalSteps === stepsLoaded) {
                    that.loaded = true;
                }
            };

            environmentService.list().then(function (environments) {
                that.environments = {
                    active: {
                        key: null,
                        value: ''
                    },
                    list: [{key: null, value: ''}].concat(environments)
                };
                evalLoaded();
                $translate('FILTERS.ENVIRONMENTS.DEFAULT_VALUE').then(function (translatedValue) {
                    that.environments.active.value = translatedValue;
                    that.environments.list[0].value = translatedValue;
                });
            });

            if (hostProvider.getHost() !== null) {
                loadSets(true,evalLoaded);
                loadTags(true,evalLoaded);
            } else {
                setEmptySetList();
                setEmptyTagList();
                // delay the loaded indication to allow for appear effects
                $timeout(function() {
                    that.loaded = true;
                },10);
            }

        };

        $scope.$on(EVENTS.HOST_UPDATED,function(event,newHost) {
            if (newHost !== null) {
                loadSets(true);
                loadTags(true);
            } else {
                setEmptySetList();
                setEmptyTagList();
            }
        });

        var setEmptySetList = function() {
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

        var setEmptyTagList = function() {
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

        var loadSets = function(forceReload,callback) {
            setService.list(forceReload).then(function (sets) {
                setEmptySetList();
                that.sets.list = that.sets.list.concat(sets);
                if (typeof callback === 'function') {
                    callback();
                }
            });
        };

        var loadTags = function(forceReload,callback) {
            tagService.list(forceReload).then(function (tags) {
                setEmptyTagList();
                that.tags.list = that.tags.list.concat(tags);
                if (typeof callback === 'function') {
                    callback();
                }
            });
        };

        loadFilter();

    }]);
