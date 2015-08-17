'use strict';
/**
 * @ngdoc overview
 * @name finqApp.writer.directives:VariableModal
 * @description
 * # Variable modal service
 *
 * Provides interaction to display a modal where the user can edit variables.
 */
angular.module('finqApp.writer.service')
    .service('$variableModal', function () {
        var variable = null;
        var isTable = false;
        var visible = false;

        this.getVariable = getVariable;
        this.showModalForVariable = showModalForVariable;
        this.setVisible = setVisible;
        this.getVisible = getVisible;

        function getVariable() {
            return visible ? variable : null;
        }

        function showModalForVariable(newVariable) {
            variable = newVariable;
            visible = true;
        }

        function setVisible(newVisible) {
            visible = newVisible;
        }

        function getVisible() {
            return visible;
        }
    });
