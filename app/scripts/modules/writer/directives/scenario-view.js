'use strict';
/**
 * @ngdoc overview
 * @name finqApp.writer.directives:ScenarioView
 * @description
 * # Scenario view directive
 *
 * Displays a category for Stories (Prologue, Scenarios, Epilogue).
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
    .controller('ScenarioViewCtrl', function ($scope, $selectedItem, $arrayOperations) {
        $scope.scenarioView = {
            deleteItem: deleteItem,
            isStepIncomplete: isStepIncomplete
        };

        $scope.selectedItem = $selectedItem;

        function deleteItem(collection, index, deletedItem) {
            $arrayOperations.removeItem(collection, index);
            if ($selectedItem.isItemSelected(deletedItem)){
                $selectedItem.clearSelectedItem();
            }
        }

        function isStepIncomplete(step) {
            return step.isIncomplete();
        }
    });
