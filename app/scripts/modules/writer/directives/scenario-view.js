'use strict';
/**
 * Created by marc.fokkert on 2-3-2015.
 */
angular.module('finqApp.writer.directive')
    .directive('scenarioView', function () {
        return {
            scope: {
                scenarios: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'views/modules/writer/directives/scenario-view.html',
            controller: 'ScenarioViewCtrl'
        };
    })
    .controller('ScenarioViewCtrl', function ($scope, selectedItem, arrayOperations) {
        $scope.scenarioView = {
            deleteItem: DeleteItem
        };

        $scope.selectedItem = {
            setSelectedItem: selectedItem.setSelectedItem,
            isItemSelected: selectedItem.isItemSelected
        };

        $scope.mainListHandler = '.handle';
        $scope.stepListHandler = '.scenario-handle';
        $scope.scenarioContentListClass = '.scenario-content-list';

        function DeleteItem(collection, index) {
            arrayOperations.removeItem(collection, index);
        }

    });
