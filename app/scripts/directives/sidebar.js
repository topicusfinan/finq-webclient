'use strict';
/**
 * Created by marc.fokkert on 6-3-2015.
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

                if (scope.expand) {
                    element.addClass('expand');
                }
            },
            controller: 'sidebarCtrl'
        };
    })
    .controller('sidebarCtrl', function ($scope, sidebar, $compile, $element) {
        $scope.watchData = watchData;
        $scope.update = reinitialize;
        $scope.toggleExpand = toggleExpand;
        $scope.isShown = sidebar.getVisible;

        function watchData() {
            return sidebar.getDirective();
        }

        function toggleExpand() {
            $element.toggleClass('expand');
        }

        function reinitialize(element) {
            element.empty();
            if (!sidebar.hasSidebar()) {
                return;
            }
            var sidebarObject = sidebar.getSidebar($scope);

            element.append($compile(sidebarObject.template)(sidebarObject.scope));
        }
    });
