'use strict';
/**
 * @ngdoc overview
 * @name finqApp.writer.directives:ScenarioVariablesView
 * @description
 * # Scenario variable view directive
 *
 * Displays variables for the selected item in a sidebar.
 */
angular.module('finqApp.writer.directive')
    .directive('scenarioVariablesView', function () {
        return {
            scope: true,
            restrict: 'A',
            templateUrl: 'views/modules/writer/directives/scenario-variables-view.html',
            controller: 'ScenarioVariablesViewCtrl',
            controllerAs: 'scenarioVariablesView'
        };
    })
    .controller('ScenarioVariablesViewCtrl', function ($scope, $selectedItem, $variableModal) {
        $scope.scenarioVariablesView = {
            variableScopes: [],
            editVariable: editVariable
        };

        $scope.$watch(function () {
                return $selectedItem.getSelectedItemId();
            },
            function (item) {
                update(item);
            });

        function editVariable(variable){
            $variableModal.showModalForVariable(variable);
        }

        function update(itemId) {
            var item = $selectedItem.getSelectedItem();
            var variableScopes = [];
            if (itemId !== null && item.getParent !== undefined) {
                if (itemId.indexOf('step') !== -1) {
                    variableScopes.push({
                        title: 'Step input values',
                        addable: false,
                        variables: item.getInputVariables()
                    });

                    variableScopes.push({
                        title: 'Step output values',
                        addable: false,
                        variables: item.getOutputVariables()
                    });
                }
            }

            $scope.scenarioVariablesView.variableScopes = variableScopes;
        }

    });
