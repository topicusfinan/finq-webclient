'use strict';

/**
 * @ngdoc overview
 * @name finqApp.directives:IncludeAndReplace
 * @description
 * # Include and replace directive
 *
 * Enhance the standard ng-include with this directive to allow replacing the DOM element to with the
 * ng-include statement is assigned.
 */
angular.module('finqApp.directive')
    .directive('includeReplace', function () {
        return {
            require: 'ngInclude',
            restrict: 'A',
            link: function (scope, el) {
                el.replaceWith(el.children());
            }
        };
    });
