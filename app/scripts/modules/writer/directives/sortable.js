/**
 * Created by marc.fokkert on 10-3-2015.
 */
angular.module('finqApp.writer.directive')
    .directive('sortable', function () {
        return {
            scope: {
                'sortable': '=', // collection to be modified
                'connectWith': '=', // connect with selector
                'handle': '=' // handle class selector
            },
            restrict: 'A',
            link: function (scope, element) {
                var jqElement = $(element);

                var sortableObject = {
                    start: function (event, ui) {
                        var ngElementScope = angular.element(ui.item).scope();
                        ngElementScope.start = ui.item.index();
                    },
                    update: function (event, ui) {
                        var animatedElements = jqElement.find('.list-animate');
                        var movedOnParent = ui.item.parent().is(element) && ui.sender === null;
                        var ngElementScope = angular.element(ui.item).scope();

                        animatedElements.removeClass('list-animate');

                        if (movedOnParent){
                            // Move on the same item so move in sortable
                            scope.sortable.splice(ui.item.index(), 0, scope.sortable.splice(ngElementScope.start, 1)[0]);
                        } else if (ui.sender === null){
                            // Item has to be removed
                            ngElementScope.removedItem = scope.sortable.splice(ngElementScope.start, 1)[0];
                        } else {
                            // Item has to be added on the correct location
                            scope.sortable.splice(ui.item.index(), 0, ngElementScope.removedItem);

                            // Remove item injected by sortable
                            ui.item.remove();

                            // This digest is needed to regenerate the element that was just removed
                            scope.$parent.$digest();
                        }

                        animatedElements.addClass('list-animate');
                    }
                };

                if (scope.handle !== undefined) {
                    sortableObject.handle = scope.handle;
                }

                jqElement.sortable(sortableObject);

                scope.$parent.$parent.$on("finqApp.scope.sortableElementAdded", function () {
                    if (scope.connectWith !== undefined){
                        jqElement.sortable('option', 'connectWith', $(scope.connectWith));
                    }
                });
                scope.$parent.$parent.$broadcast("finqApp.scope.sortableElementAdded");
            }
        }
    });
