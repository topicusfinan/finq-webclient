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
        this.addNewTab = addNewTab;
        this.variable = null;

        this.close = close;
        this.apply = apply;

        var originalTabs = [];
        this.simple = false;

        this.tabs = [];
        this.getVisible = variableModal.getVisible;

        this.ignoreUndefinedFilter = ignoreUndefinedFilter;
        function ignoreUndefinedFilter(value) {
            return value !== undefined;
        }

        var originalVariable = null;
        var emptyTabTemplate = [];

        $scope.$watch(function () {
            return variableModal.getVariable();
        }, function (variable) {
            if (variable === null) {
                close();
                return;
            }

            if (variable.isTable()) {
                showTable(variable.table.tableData, variable.table.tableHeader);
            } else {
                showVariable(variable);
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

        /**
         * Add a new tab
         */
        function addNewTab() {
            addTab(angular.copy(emptyTabTemplate));
        }

        /**
         * Add a tab and display it
         * @param tab Tab to be added
         */
        function addTab(tab) {
            that.tabs.push(tab);
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
