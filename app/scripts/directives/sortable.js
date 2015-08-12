/*global $: false */
'use strict';
/**
 * @ngdoc overview
 * @name finqApp.writer.directive:Sortable
 * @description
 * # Sortable directive
 *
 * Wrapper for JQueryUI's sortable
 * Uses the following scope values:
 * *sortable*: Collection to be modified
 * *connectWith*: Connect with selector
 * *handle*: handle class selector
 *
 */
angular.module('finqApp.directive')
    .directive('sortable', function (EVENTS, $timeout) {
        return {
            restrict: 'A',
            controller: 'SortableCtrl',
            link: function (scope, element, attrs) {
                var jqElement = $(element);

                var sortableObject = {
                    start: function (event, ui) {
                        scope.sortableObjectStart(event, ui, element);
                        scope.setClasses(element, attrs.connectWith);
                        $timeout(function(){
                            jqElement.sortable('refresh'); // Required to update positions after styling changes
                        });
                    },
                    update: function (event, ui) {
                        scope.removeClasses(element, attrs.connectWith);
                        scope.sortableObjectEnd(event, ui, element);
                    },
                    stop: function () {
                        scope.removeClasses(element, attrs.connectWith);
                    }
                };

                scope.sortable = scope.$eval(attrs.sortable);

                if (attrs.handle !== undefined) {
                    sortableObject.handle = attrs.handle;
                }

                jqElement.sortable(sortableObject);

                scope.$root.$on(EVENTS.SCOPE.SORTABLE_ELEMENT_ADDED, function () {
                    if (attrs.connectWith !== undefined && jqElement.sortable('instance') !== undefined) {
                        jqElement.sortable('option', 'connectWith', $(attrs.connectWith));
                    }
                });
                scope.$root.$broadcast(EVENTS.SCOPE.SORTABLE_ELEMENT_ADDED);
            }
        };
    })
    .controller('SortableCtrl', ['$scope', 'arrayOperations', '$rootScope', function ($scope, arrayOperations, $rootScope) {
        $scope.sortableObjectStart = sortableObjectStart;
        $scope.sortableObjectEnd = sortableObjectEnd;
        $scope.removeClasses = removeClasses;
        $scope.setClasses = setClasses;

        function sortableObjectStart(event, ui) {
            var ngElementScope = angular.element(ui.item).scope();
            ngElementScope.start = ui.item.index();
        }

        function setClasses(element, connectWith) {
            if (connectWith) {
                element.parents().last().find(connectWith).addClass('sorting');
            }
            element.addClass('sorting');
        }

        function removeClasses(element, connectWith) {
            if (connectWith) {
                element.parents().last().find(connectWith).removeClass('sorting');
            }
            element.removeClass('sorting');
        }

        function sortableObjectEnd(event, ui, element) {
            var animatedElements = $(element).find('.list-animate').add($(element).has('.list-animate'));
            var movedOnParent = ui.item.parent().is(element) && ui.sender === null;
            var ngElementScope = angular.element(ui.item).scope();

            animatedElements.removeClass('list-animate');

            // TODO refactor to use 'receive' and 'remove' events
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
    }]);
