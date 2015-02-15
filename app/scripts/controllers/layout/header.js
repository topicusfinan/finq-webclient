'use strict';

/**
 * @ngdoc overview
 * @name finqApp:HeaderCtrl
 * @description
 * # Header controller
 *
 * The header controller handles the dynamic rendering of the application header, including the title to display,
 * the search function and the account control.
 */
angular.module('finqApp.controller')
    .controller('HeaderCtrl', [
        '$rootScope',
        '$scope',
        '$timeout',
        'config',
        'value',
        'storybookSearch',
        'EVENTS',
        'authenticate',
        function ($rootScope, $scope, $timeout, configProvider, valueService, storybookSearchService, EVENTS, authenticateService) {
            var that = this,
                searchTimeout = null;
            this.title = configProvider.server().subject;
            this.timeout = configProvider.client().searchWait;
            this.defaultUserImage = configProvider.client().defaultUserImage;
            this.query = '';
            this.currentUser = authenticateService.getCurrentUser;

            this.search = function () {
                if (searchTimeout !== null) {
                    clearTimeout(searchTimeout);
                }
                searchTimeout = setTimeout(function () {
                    if (that.query !== valueService.searchQuery) {
                        valueService.searchQuery = that.query;
                        $rootScope.$broadcast(EVENTS.SCOPE.SEARCH_UPDATED, that.query);
                        $scope.$apply();
                    }
                }, that.timeout);
            };

        }]);
