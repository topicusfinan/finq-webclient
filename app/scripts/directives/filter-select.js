'use strict';

/**
 * @ngdoc overview
 * @name finqApp.directives:FilterSelect
 * @description
 * # Filter select dropdown
 *
 * A filter dropdown select button with dynamic options linked to models.
 */
angular.module('finqApp.directives').directive('filterSelect', ['$timeout', function ($timeout) {
    return {
        scope: {
            values: '=filterSelect'
        },
        restrict: 'A',
        templateUrl: 'views/directives/select.html',
        link: function (scope) {
            var hideTimer;
            scope.show = false;

            scope.toggle = function() {
                scope.show = !scope.show;
                $timeout.cancel(hideTimer);
            };
            scope.hide = function() {
                hideTimer = $timeout(
                    function () {
                        scope.show = false;
                    },
                    100
                );
            };
            scope.select = function(key,value) {
                scope.values.active.key = key;
                scope.values.active.value = value;
            };
        }
    };
}]);
