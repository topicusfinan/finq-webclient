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
                //scope.registerSortable();


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

        $scope.mainListHandler = '.handle';
        $scope.stepListHandler = '.scenario-handle';
        $scope.scenarioContentListClass = '.scenario-content-list';

        //$scope.registerSortable = RegisterSortable;

        function DeleteScenario(scenario) {
            // TODO
        }

        function ApplyScenarioTitle(scenario) {
            scenario.title = scenario.editorTitle;
        }

        function IsStepIncomplete(step) {
            // TODO create a service to evaluate this

        }


        //var start;
        //function RegisterSortable(){
        //    $('.main-content-list').sortable({
        //        handle: '.handle',
        //        start: function(event,ui){
        //            start = ui.item.index();
        //        },
        //        update: function(event, ui){
        //            var animatedElements = $('.main-content-list').find('.list-animate');
        //            animatedElements.removeClass('list-animate');
        //            MoveObject($scope.scenarios, start, ui.item.index());
        //            $scope.$digest(); // this digest is needed to make sure $index on scope aligns with the array
        //            animatedElements.addClass('list-animate');
        //        }
        //    });
        //    $('.scenario-content-list').eq(0).sortable({
        //        handle: '.scenario-handle',
        //        start: function(event, ui){
        //            start = ui.item.index();
        //        },
        //        update: function(event,ui){
        //            var animatedElements = $('.scenario-content-list').find('.list-animate');
        //            animatedElements.removeClass('list-animate');
        //            MoveObject(ui.item.$scope.$parent.steps, start, ui.item.index());
        //        }
        //    });
        //}
        //
        //function MoveObject(array, originalPosition, insertPosition){
        //    array.splice(insertPosition, 0, array.splice(originalPosition, 1)[0]);
        //}
    });
