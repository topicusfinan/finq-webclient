/**
 * Created by marc.fokkert on 10-3-2015.
 */
angular.module('finqApp.writer.directive')
    .directive('sortable', function () {
        return {
            //scope: {
            //    'sortable': '=', // collection to be modified
            //    'connectWith': '=', // connect with selector
            //    'handle': '=' // handle class selector
            //},
            restrict: 'A',
            controller: 'SortableCtrl',
            link: function (scope, element) {
                var jqElement = $(element);

                var sortableObject = {
                    start: function (event, ui) {
                        scope.sortableObjectStart(event, ui);
                    },
                    update: function (event, ui) {
                        scope.sortableObjectEnd(event, ui, element);
                    }
                };

                if (scope.handle !== undefined) {
                    sortableObject.handle = scope.handle;
                }

                jqElement.sortable(sortableObject);

                scope.$parent.$parent.$on("finqApp.scope.sortableElementAdded", function () {
                    if (scope.connectWith !== undefined) {
                        jqElement.sortable('option', 'connectWith', $(scope.connectWith));
                    }
                });
                scope.$parent.$parent.$broadcast("finqApp.scope.sortableElementAdded");
            }
        }
    })
    .controller('SortableCtrl', function ($scope, arrayOperations) {
        $scope.sortableObjectStart = SortableObjectStart;
        $scope.sortableObjectEnd = SortableObjectEnd;

        function SortableObjectStart(event, ui){
            var ngElementScope = angular.element(ui.item).scope();
            ngElementScope.start = ui.item.index();
        }

        function SortableObjectEnd(event, ui, element){
            var animatedElements = $(element).find('.list-animate');
            var movedOnParent = ui.item.parent().is(element) && ui.sender === null;
            var ngElementScope = angular.element(ui.item).scope();

            animatedElements.removeClass('list-animate');

            if (movedOnParent) {
                // Move on the same item so move in sortable
                arrayOperations.moveItem($scope.sortable, ngElementScope.start, ui.item.index());
            } else if (ui.sender === null) {
                // Item has to be removed
                ngElementScope.removedItem = arrayOperations.removeItem($scope.sortable, ngElementScope.start);
            } else {
                // Item has to be added on the correct location
                arrayOperations.insertItem($scope.sortable, ui.item.index(), ngElementScope.removedItem);

                // Remove item injected by sortable
                ui.item.remove();

                // This digest is needed to regenerate the element that was just removed
                $scope.$parent.$digest();
            }

            animatedElements.addClass('list-animate');
        }
    });
