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
        '$scope',
        '$timeout',
        'config',
        'EVENTS',
        function ($scope,$timeout,configProvider,EVENTS) {
        var that = this,
            prevQuery = '',
            searchTimeout = null;
        this.title = configProvider.server().subject;
        this.timeout = configProvider.client().searchWait;
        this.query = '';

        // delay the loaded indication to allow for appear effects
        $timeout(function() {
            that.loaded = true;
        },10);

        this.search = function() {
            if (searchTimeout !== null) {
                clearTimeout(searchTimeout);
            }
            searchTimeout = setTimeout(function() {
                if (that.query !== prevQuery) {
                    $scope.$emit(EVENTS.SCOPE.SEARCH_UPDATED,that.query);
                    prevQuery = that.query;
                    $scope.$apply();
                }
            },that.timeout);
        };

    }]);
