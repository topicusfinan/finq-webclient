'use strict';
/**
 * Created by marc.fokkert on 4-3-2015.
 */
angular.module('finqApp.writer.directive')
    .directive('scenarioVariablesView', function () {
        return {
            scope: {
            },
            restrict: 'A',
            templateUrl: 'views/modules/writer/directives/scenario-variables-view.html',
            controller: 'ScenarioVariablesViewCtrl',
            controllerAs: 'scenarioVariablesView'
        };
    })
    .controller('ScenarioVariablesViewCtrl', function ($scope, selectedItem) {
        $scope.scenarioVariablesView = {
            variableScopes: []
        };

        $scope.$watch(function () {
                return selectedItem.getSelectedItemId();
            },
            function (item) {
                update(item);
            });

        function update(itemId) {
            var item = selectedItem.getSelectedItem();
            var variableScopes = [];
            if (itemId !== null && item.getParent !== undefined) {
                // TODO Fill scenario input values


                if (itemId.indexOf('step') !== -1) {
                    // step
                    variableScopes.push({
                        title: 'Scenario attribute values',
                        addable: true,
                        variables: item.getParent().getInputVariables()
                    });

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


                    variableScopes.push({
                        title: 'Scenario output values',
                        addable: true,
                        variables: item.getParent().getOutputVariables()
                    });
                } else {
                    // Scenario
                    variableScopes.push({
                        title: 'Scenario input values',
                        addable: true,
                        variables: item.getInputVariables()
                    });

                    variableScopes.push({
                        title: 'Scenario output values',
                        addable: true,
                        variables: item.getOutputVariables()
                    });
                }

            }

            $scope.scenarioVariablesView.variableScopes = variableScopes;
        }


    });
