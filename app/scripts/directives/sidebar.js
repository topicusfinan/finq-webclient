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
        $scope.watchData = WatchData;
        $scope.update = Update;
        $scope.getVisible = GetVisible;
        $scope.setVisible = SetVisible;

        function WatchData() {
            return sidebar.getDirective();
        }

        function GetVisible() {
            return sidebar.getVisible();
        }

        function SetVisible(element, visible){
            element.css('visibility', visible ? 'visible' : 'hidden');
        }

        function Update(element) {
            element.empty();
            if (!sidebar.hasSidebar()) {
                return;
            }
            var sidebarObject = sidebar.getSidebar($scope);

            element.append($compile(sidebarObject.template)(sidebarObject.scope));
        }
    });
