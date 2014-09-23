'use strict';

/**
 * @ngdoc overview
 * @name finqApp.directives:Pagination
 * @description
 * # Standardized pagination directive
 *
 * Handle basic pagination for a listing
 */
angular.module('finqApp.directive')
    .directive('pagination', ['EVENTS',function (EVENTS) {
        return {
            scope: {
                currentPage: '=',
                hasNext: '&',
                listRef: '='
            },
            restrict: 'A',
            templateUrl: 'views/directives/paginate.html',
            link: function (scope) {
                scope.$on(EVENTS.SCOPE.CONTENT_LIST_UPDATED,function(event,updatedListRef) {
                    if (scope.listRef === updatedListRef) {
                        scope.hasMultiplePages = scope.hasNext();
                    }
                });
                scope.hasMultiplePages = scope.hasNext();
            }
        };
    }]);
