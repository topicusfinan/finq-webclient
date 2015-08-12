'use strict';
/**
 * @ngdoc overview
 * @name finqApp.writer.directives:VariableModal
 * @description
 * # Variable modal directive
 *
 * Displays a modal window where a user can edit simple or complex variables.
 * Complex variables are collections where the user has one tab for each item.
 */
angular.module('finqApp.writer.directive')
    .directive('variableModal', function () {
        return {
            scope: {},
            restrict: 'A',
            link: function (scope, element) {
                element.addClass('modal-wrapper');
                scope.$watch('variableModalCtrl.getVisible()', function (value) {
                    if (value) {
                        element.removeClass('ng-hide');
                    } else {
                        element.addClass('ng-hide');
                    }
                });
            },
            controller: 'variableModalCtrl',
            controllerAs: 'variableModalCtrl',
            templateUrl: 'views/modules/writer/directives/variable-modal.html'
        };
    })
    .controller('variableModalCtrl', function (arrayOperations, variableModal, $scope, storyVariable) {
        var that = this;
        this.title = 'test title';
        this.description = 'test description';
        this.visibleTab = 0;
        this.removeTab = removeTab;
        this.addTab = addTab;
        this.variable = null;

        var originalVariable = null;
        var emptyTabTemplate = [];

        this.close = close;
        this.apply = apply;

        var originalTabs = [];
        this.simple = false;

        this.tabs = [];
        this.getVisible = variableModal.getVisible;
        this.ignoreUndefined = ignoreUndefined;

        function ignoreUndefined(value) {
            return value !== undefined;
        }

        $scope.$watch(function () {
            return variableModal.getVariable();
        }, function (value) {
            if (value === null) {
                close();
                return;
            }

            if (value.isTable()) {
                showTable(value.table.tableData, value.table.tableHeader);
            } else {
                showVariable(value);
            }
        });

        function removeTab(index) {
            delete that.tabs[index];
            // delete behavior (which tab gets selected after a delete)
            if (that.visibleTab > 1) {
                that.visibleTab--;
            } else {
                that.visibleTab = 0;
            }
        }

        function addTab() {
            that.tabs.push(angular.copy(emptyTabTemplate));
            that.visibleTab = that.tabs.length - 1;
        }

        function showVariable(variable) {
            that.simple = true;
            originalVariable = variable;

            // Create new copy, including all methods
            that.variable = angular.copy(originalVariable);


            // Re-setup variable helper methods. Important! Old methods still refer to that.variable scope!
            storyVariable.setupVariable(that.variable);
        }

        function showTable(table, emptyTableRow) {
            that.simple = false;
            originalTabs = table;
            that.tabs = angular.copy(table);
            emptyTabTemplate = emptyTableRow;
        }

        function close() {
            that.tabs = [];
            emptyTabTemplate = [];
            that.variable = null;
            variableModal.setVisible(false);
        }

        function apply() {
            if (that.simple) {
                // Cannot use merge here! Original variable helper functions shouldn't be overridden.
                originalVariable.getSetValue(that.variable.getSetValue());
            } else {
                // Sync objects
                angular.merge(originalTabs, that.tabs);

                // Remove all deleted items from both collections (undefined in tabs, but can have a value in originalTabs)
                for (var i = 0; i < that.tabs.length; i++) {
                    if (that.tabs[i] === undefined) {
                        arrayOperations.removeItem(originalTabs, i);
                        arrayOperations.removeItem(that.tabs, i);
                    }
                }
            }
            close();
        }
    });
