/*global $: false */
'use strict';
/**
 * Created by marc.fokkert on 10-3-2015.
 */
angular.module('finqApp.writer.directive')
    .directive('sortable', function (EVENTS) {
        return {
            //scope: {
            //    'sortable': '=', // collection to be modified
            //    'connectWith': '=', // connect with selector
            //    'handle': '=' // handle class selector
            //},
            restrict: 'A',
            controller: 'SortableCtrl',
            link: function (scope, element, attrs) {
                var jqElement = $(element);

                var sortableObject = {
                    start: function (event, ui) {
                        scope.sortableObjectStart(event, ui, element);
                        scope.setClasses(element, attrs.connectWith);
                    },
                    update: function (event, ui) {
                        scope.sortableObjectEnd(event, ui, element);
                        scope.removeClasses(element, attrs.connectWith);
                    },
                    stop: function () {
                        scope.removeClasses(element, attrs.connectWith);
                    }
                };

                scope.sortable = scope[attrs.sortable];

                if (attrs.handle !== undefined) {
                    sortableObject.handle = attrs.handle;
                }

                jqElement.sortable(sortableObject);

                scope.$parent.$parent.$on(EVENTS.SCOPE.SORTABLE_ELEMENT_ADDED, function () {
                    if (attrs.connectWith !== undefined) {
                        jqElement.sortable('option', 'connectWith', $(attrs.connectWith));
                    }
                });
                scope.$parent.$parent.$broadcast(EVENTS.SCOPE.SORTABLE_ELEMENT_ADDED);
            }
        };
    })
    .controller('SortableCtrl', function ($scope, arrayOperations, $rootScope) {
        $scope.sortableObjectStart = sortableObjectStart;
        $scope.sortableObjectEnd = sortableObjectEnd;
        $scope.removeClasses = removeClasses;
        $scope.setClasses = setClasses;

        function sortableObjectStart(event, ui){
            var ngElementScope = angular.element(ui.item).scope();
            ngElementScope.start = ui.item.index();
        }

        function setClasses(element, connectWith) {
            if (connectWith) {
                $(connectWith).addClass('sorting');
            } else {
                element.addClass('sorting');
            }
        }

        function removeClasses(element, connectWith) {
            if (connectWith) {
                $(connectWith).removeClass('sorting');
            } else {
                element.removeClass('sorting');
            }
        }

        function sortableObjectEnd(event, ui, element){
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
                $rootScope.$digest();
            }

            animatedElements.addClass('list-animate');
        }
    });
