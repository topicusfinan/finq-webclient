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
 *     "active" : [{
 *         "key" : <key that identifies the active select item>,
 *         "value" : <visual representation of the selected item>
 *     }],
 *     "list" : [
 *         {
 *             "key" : <option key>
 *             "value" : <option display value>
 *         }
 *     ]
 * }
 */
angular.module('finqApp.directive')
    .directive('filterSelect', ['$timeout','$translate','EVENTS', function ($timeout,$translate,EVENTS) {
        return {
            scope: {
                options: '=filterSelect',
                multiple: '=',
                defkey: '=default',
                placeholder: '=',
                id: '=filterId'
            },
            restrict: 'A',
            templateUrl: 'views/directives/select.html',
            link: function (scope) {
                var active,
                    placeholder;

                if (scope.placeholder !== undefined) {
                    placeholder = [{
                        key: null,
                        value: ''
                    }];
                    active = placeholder;
                    scope.options = placeholder.concat(scope.options);
                    $translate('FILTERS.ENVIRONMENTS.DEFAULT_VALUE').then(function (translatedValue) {
                        active[0].value = translatedValue;
                        scope.options[0].value = translatedValue;
                    });
                }
                if (scope.defkey !== undefined) {
                    var found = false;
                    for (var i=0; i<scope.options.length; i++) {
                        if (scope.options[i].key === scope.defkey) {
                            active = [{
                                key: scope.options[i].key,
                                value: scope.options[i].value
                            }];
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        throw new Error('Invalid default filter value for filter '+scope.id+' the key '+scope.defkey+' could not be found in the passed options list');
                    }
                }
                if (scope.defkey === undefined && scope.placeholder === undefined) {
                    throw new Error('Missing default value or placeholder for filter '+scope.id);
                }
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
                    var newKeys;
                    if (scope.multiple) {
                        newKeys = multipleToggle(key,value);
                    } else {
                        newKeys = singleSelect(key,value);
                    }
                    scope.$emit(EVENTS.FILTER_SELECT_UPDATED,{
                        id: scope.id,
                        keys: newKeys
                    });
                };
                scope.getValue = function() {
                    // implement
                };

                var singleSelect = function(key,value) {
                    if (active[0].key === key) {
                        return;
                    }
                    active[0].key = key;
                    active[0].value = value;
                    return [key];
                };

                var multipleToggle = function(key,value) {
                    var keys = [],
                        found = false;
                    for (var i=0; i<active.length; i++) {
                        if (active[i].key === key) {
                            found = true;
                            active.splice(i,1);
                        } else {
                            keys.push(active[i].key);
                        }
                    }
                    if (!found) {
                        active.push({
                            key: key,
                            value: value
                        });
                    }
                    return keys;
                };
            }
        };
    }]);
