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
        'EVENTS',
        'MODULES',
        'FILTER_SELECT_EVENTS',
        'story',
        'storybookSearch',
        function ($scope,EVENTS,MODULES,FILTER_SELECT_EVENTS,storyService,storybookSearchService) {
        var that = this;

        this.storybooks = [];
        this.setFilterId = 'set';
        this.tagFilterId = 'tag';
        this.filterKeys = {
            tag: null,
            set: null
        };
        this.filterActive = true;

        // emit the controller updated event immediately after loading to update the page information
        $scope.$emit(EVENTS.PAGE_CONTROLLER_UPDATED,{
            module: MODULES.RUNNER,
            // our default section is the list with available scenarios that can be run
            section: MODULES.RUNNER.sections.AVAILABLE
        });

        storyService.list().then(function(bookList) {
            that.storybooks = bookList;
            that.storiesLoaded = true;
            storybookSearchService.initialize(bookList);
        });

        $scope.$on(FILTER_SELECT_EVENTS.UPDATED,function(event,filterInfo) {
            that.filterKeys[filterInfo.id] = filterInfo.key;
        });

    }]);
