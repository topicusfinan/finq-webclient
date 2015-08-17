'use strict';

/**
 * @ngdoc overview
 * @name finqApp.directives:Sidebar
 * @description
 * # Sidebar directive
 *
 * Displays a directive with a provided scope in a sidebar container.
 */
angular.module('finqApp.directive')
    .directive('sidebar', function () {
        return {
            scope: {
                expand: '=sidebar'
            },
            restrict: 'A',
            link: function (scope, element) {
                scope.$watch(scope.watchData, function () {
                    scope.update(element);
                });
            },
            controller: 'sidebarCtrl'
        };
    })
    .controller('sidebarCtrl', function ($scope, $sidebar, $compile, $element, STATE) {
        $scope.watchData = watchData;
        $scope.update = reinitialize;

        if ($scope.expand) {
            $sidebar.expand();
        } else {
            $sidebar.collapse();
        }

        function watchData() {
            return $sidebar.getDirective();
        }

        function reinitialize(element) {
            element.empty();
            if ($sidebar.getStatus() === STATE.SIDEBAR.HIDDEN) {
                return;
            }
            var sidebarObject = $sidebar.get($scope);

            element.append($compile(sidebarObject.template)(sidebarObject.scope));
        }
    });
