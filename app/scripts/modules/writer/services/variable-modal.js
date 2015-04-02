'use strict';
/**
 * Created by marc.fokkert on 27-3-2015.
 */


angular.module('finqApp.writer.service')
    .service('variableModal', function () {
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
