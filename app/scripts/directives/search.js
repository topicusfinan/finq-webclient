'use strict';

/**
 * @ngdoc overview
 * @name finqApp.directives:Search
 * @description
 * # Search directive
 *
 * A generic search directive that allows the user to input a search query, which will trigger
 * a search event.
 */
angular.module('finqApp.directive')
    .directive('search', function () {
        return {
            restrict: 'A',
            controller: 'searchCtrl',
            controllerAs: 'search',
            templateUrl: 'views/directives/search.html'
        };
    })
    .controller('searchCtrl', function ($scope, $config, EVENTS) {
            var that = this,
                searchTimeout = null;
            this.timeout = $config.client().searchWait;
            this.query = '';
            this.currentSearch = '';

            this.find = function () {
                if (searchTimeout !== null) {
                    clearTimeout(searchTimeout);
                }
                searchTimeout = setTimeout(function () {
                    if (that.query !== that.currentSearch) {
                        that.currentSearch = that.query;
                        $scope.$emit(EVENTS.SCOPE.SEARCH_UPDATED, that.query);
                        $scope.$apply();
                    }
                }, that.timeout);
            };
        });
