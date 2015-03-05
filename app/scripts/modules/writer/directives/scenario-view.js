/** * Created by marc.fokkert on 2-3-2015.
 */
angular.module('finqApp.writer.directive')
    .directive('scenarioView', function () {
        return {
            scope: {
                scenarios: '='
            },
            restrict: 'E',
            templateUrl: 'views/modules/writer/directives/scenario-view.html',
            controller: 'ScenarioViewCtrl',
            link: function (scope) {


            }
        }
    })
    .controller('ScenarioViewCtrl', function ($scope, selectedItem) {
        $scope.scenarioView = {
            deleteScenario: DeleteScenario,
            isStepIncomplete: IsStepIncomplete,
            applyScenarioTitle: ApplyScenarioTitle
        };

        $scope.selectedItem = {
            setSelectedItem: selectedItem.setSelectedItem,
            isItemSelected: selectedItem.isItemSelected
        };

        function DeleteScenario(scenario) {
            // TODO
        }

        function ApplyScenarioTitle(scenario) {
            scenario.title = scenario.editorTitle;
        }

        function IsStepIncomplete(step) {
            // TODO create a service to evaluate this


        }
    });
