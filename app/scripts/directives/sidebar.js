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
            },
            controller: 'sidebarCtrl'
        };
    })
    .controller('sidebarCtrl', function ($scope, sidebar, $compile, $element, STATE) {
        $scope.watchData = watchData;
        $scope.update = reinitialize;
        $scope.toggleExpand = toggleExpand;

        if ($scope.expand) {
            sidebar.expand();
        } else {
            sidebar.collapse();
        }

        function watchData() {
            return sidebar.getDirective();
        }

        function toggleExpand() {
            switch (sidebar.getStatus()) {
                case STATE.SIDEBAR.COLLAPSED:
                    sidebar.expand();
                    break;
                case STATE.SIDEBAR.EXPANDED:
                    sidebar.collapse();
                    break;
                default: break;
            }
        }

        function reinitialize(element) {
            element.empty();
            if (sidebar.getStatus() === STATE.SIDEBAR.HIDDEN) {
                return;
            }
            var sidebarObject = sidebar.get($scope);

            element.append($compile(sidebarObject.template)(sidebarObject.scope));
        }
    });
