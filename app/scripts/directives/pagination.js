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
    .directive('pagination', function () {
        return {
            scope: {
                currentPage: '=',
                hasNext: '&'
            },
            restrict: 'A',
            templateUrl: 'views/directives/paginate.html',
            link: function (scope) {
                scope.hasMultiplePages = scope.hasNext();
            }
        };
    });
