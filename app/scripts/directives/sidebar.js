/**
 * Created by marc.fokkert on 6-3-2015.
 */
angular.module('finqApp.directive')
    .directive('sidebar', function () {
        return {
            scope: {},
            restrict: 'A',
            link: function (scope, element) {
                scope.$watch(scope.watchData, function () {
                    scope.update(element);
                });
                scope.$watch(scope.getVisible, function (value) {
                    scope.setVisible(element, value);
                });
            },
            controller: 'sidebarCtrl'
        }
    })
    .controller('sidebarCtrl', function ($scope, sidebar, $compile) {
        $scope.watchData = watchData;
        $scope.update = update;
        $scope.getVisible = getVisible;
        $scope.setVisible = setVisible;

        function watchData() {
            return sidebar.getDirective();
        }

        function getVisible() {
            return sidebar.getVisible();
        }

        function setVisible(element, visible){
            element.css('visibility', visible ? 'visible' : 'hidden');
        }

        function update(element) {
            element.empty();
            if (!sidebar.hasSidebar()) {
                return;
            }
            var sidebarObject = sidebar.getSidebar($scope);

            element.append($compile(sidebarObject.template)(sidebarObject.scope));
        }
    });
