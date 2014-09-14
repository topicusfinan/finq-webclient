'use strict';

/**
 * @ngdoc overview
 * @name finqApp.directives:FilterSelect
 * @description
 * # Filter select dropdown
 *
 * A filter dropdown select button with dynamic options linked to models. To use it add the attribute
 * "filter-select" to your DOM tag and provide it with a reference to the controller object that contains
 * the list of values that the user can select. This object needs to be in the following format:
 *
 * {
 *     "active" : {
 *         "key" : <key that identifies the active select item>,
 *         "value" : <visual representation of the selected item>
 *     },
 *     "list" : [
 *         {
 *             "key" : <option key>
 *             "value" : <option display value>
 *         }
 *     ]
 * }
 */
angular.module('finqApp.directive')
    .directive('filterSelect', ['$timeout','EVENTS', function ($timeout,EVENTS) {
        return {
            scope: {
                options: '=filterSelect',
                id: '=filterId'
            },
            restrict: 'A',
            templateUrl: 'views/directives/select.html',
            link: function (scope) {
                var hideTimer;
                scope.show = false;

                scope.toggle = function() {
                    scope.show = !scope.show;
                    $timeout.cancel(hideTimer);
                };
                scope.hide = function() {
                    hideTimer = $timeout(
                        function () {
                            scope.show = false;
                        },
                        100
                    );
                };
                scope.select = function(key,value) {
                    if (scope.options.active.key === key) {
                        return;
                    }
                    scope.options.active.key = key;
                    scope.options.active.value = value;
                    // emit the controller updated event immediately after loading to update the page information
                    scope.$emit(EVENTS.FILTER_SELECT_UPDATED,{
                        id: scope.id,
                        key: key
                    });
                };
            }
        };
    }]);
