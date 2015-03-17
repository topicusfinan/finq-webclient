'use strict';
/**
 * @ngdoc function
 * @name finqApp.writer.service:storyVariables
 * @description
 * # Story variable service
 *
 * Bind helper functions to a data structure with variables.
 *
 */
angular.module('finqApp.writer.service')
    .service('storyVariable', function () {
        var INPUT = 'input', OUTPUT = 'output';
        this.setupVariables = setupVariables;
        this.setupVariable = setupVariable;
        this.setupNode = setupNode;
        var rootObject;

        /**
         * Look up a variable within a collection (rootObject)
         * @return {*} undefined or the requested variable
         */
        function lookupVariable(id) {
            var result;

            if (rootObject.variables !== undefined) {
                result = checkNode(rootObject, id);
            } else {
                result = checkNode(findChildrenProperty(rootObject), id);
            }

            return result === null ? undefined : result;

            /// Functions
            /**
             * Helper function for checkNode
             * @param collection Collection of child nodes
             * @param compareId Id to compare to
             * @returns {*}
             */
            function checkChildren(collection, compareId) {
                for (var i = 0; i < collection.length; i++) {
                    var nodeResult = checkNode(collection[i], compareId);
                    if (nodeResult !== null) {
                        return nodeResult;
                    }
                }
                return null;
            }

            /**
             * Recursively check a node for the requested variable
             * @param node Node to evaluate
             * @param compareId Id to compare to
             * @returns {*}
             */
            function checkNode(node, compareId) {
                var j;
                var input = node.variables.input;
                var output = node.variables.output;
                for (j = 0; j < input.length; j++) {
                    if (input[j].id === compareId) {
                        return input[j];
                    }
                }
                for (j = 0; j < output.length; j++) {
                    if (output[j].id === compareId) {
                        return output[j];
                    }
                }
                var children = findChildrenProperty(node);
                if (children !== null) {
                    return checkChildren(children, compareId);
                }
                return null;
            }
        }

        /**
         * @return {null}
         */
        function resolveReference(id) {
            var referenceVariable = lookupVariable(id);
            if (referenceVariable !== undefined) {
                if (referenceVariable.reference !== undefined) {
                    return resolveReference(referenceVariable.reference);
                } else {
                    return referenceVariable;
                }
            }
            return null;
        }


        /**
         * Bind helper functions to an object structure with variables
         * @param objectWithVariables (JSON) object with a variable structure
         */
        function setupVariables(objectWithVariables) {
            rootObject = objectWithVariables;
            setupVariablesRec(rootObject, null);
        }

        /**
         * Helper function for setupVariable
         * @param objectWithVariables (JSON) object with a variable structure
         * @param parent Parent object
         */
        function setupVariablesRec(objectWithVariables, parent) {
            var i;
            if (objectWithVariables.variables !== undefined) {
                var input = objectWithVariables.variables.input;
                var output = objectWithVariables.variables.output;

                // Set up input and output variables
                for (i = 0; i < input.length; i++) {
                    setupVariable(input[i], INPUT);
                }
                for (i = 0; i < output.length; i++) {
                    setupVariable(output[i], OUTPUT);
                }
            }


            // Recursive call
            var children = findChildrenProperty(objectWithVariables);
            if (children !== null) {
                for (i = 0; i < children.length; i++) {
                    setupVariablesRec(children[i], objectWithVariables);
                }
            }

            // Register methods
            setupNode(objectWithVariables, parent);
        }

        /**
         * Bind helper functions to a node
         * @param node An object with variables
         * @param parent Parent object to be linked
         */
        function setupNode(node, parent) {
            node.getInputVariables = getInputVariables;
            node.getOutputVariables = getOutputVariables;
            node.addInputVariable = addInputVariable;
            node.addOutputVariable = addOutputVariable;
            node.getParent = getParent;

            function getInputVariables() {
                return node.variables.input;
            }

            function getOutputVariables() {
                return node.variables.output;
            }

            function addInputVariable(variableData){
                setupVariable(variableData, INPUT);
                node.variables.input.push(variableData);
            }

            function addOutputVariable(variableData){
                setupVariable(variableData, OUTPUT);
                node.variables.output.push(variableData);
            }

            function getParent() {
                return parent;
            }
        }

        /**
         * Bind helper functions to variable
         * @param variableData Variable data
         * @param inputOutput Whether the variable is input or output
         */
        function setupVariable(variableData, inputOutput) {
            var cachedReference = null;
            // Register methods
            variableData.getName = getName;
            variableData.isReference = isReference;
            variableData.isValue = isValue;
            variableData.getResolvedValue = getResolvedValue;
            variableData.getResolvedID = getResolvedID;
            variableData.getVariableClass = getVariableClass;
            variableData.getActualValue = getActualValue;
            variableData.getActualID = getActualID;
            variableData.setActualValue = setActualValue;
            variableData.setReference = setReference;

            // Functions
            /**
             * Get the actual unresolved value (no references)
             * @returns {*}
             */
            function getActualValue() {
                return variableData.value;
            }

            /**
             * Get the actual unresolved id (no references)
             * @returns {*}
             */
            function getActualID() {
                return variableData.id;
            }

            /**
             * Get the actual unresolved value, the resolved value, or the name of the resolved value
             * Will only return the name on a referenced value, if not a reference it will return undefined (actual value)
             * @returns {*}
             */
            function getResolvedValue() {
                if (isReference()) {
                    var variable = resolveReference(variableData.reference);
                    if (variable !== undefined) {
                        return variable.getResolvedValue() || variable.getName();
                    }
                    return variable;
                }
                return getActualValue();
            }

            /**
             * Get the ID of the variable which value is displayed by getResolvedValue
             * @return {*}
             */
            function getResolvedID() {
                if (isReference()) {
                    var variable = resolveReference(variableData.reference);
                    if (variable !== undefined) {
                        return variable.getResolvedID();
                    }
                    return variable;
                }
                return getActualID();
            }

            function getName() {
                return variableData.name;
            }

            /**
             * @return {string}
             */
            function getVariableClass() {
                var classBuild = [];
                if (inputOutput === INPUT) {
                    classBuild.push('input');
                } else {
                    classBuild.push('output');
                }

                if (variableData.reference === undefined && variableData.value === undefined) {
                    if (inputOutput === OUTPUT) {
                        classBuild.push('runtime');
                    } else {
                        classBuild.push('undefined');
                    }
                } else if (variableData.value !== undefined) {
                    classBuild.push('user');
                } else {
                    classBuild.push('reference');
                }
                return classBuild.join(' ');
            }

            /**
             * Set the actual value and remove any reference
             * @param value
             */
            function setActualValue(value) {
                cachedReference = null;
                delete variableData.reference;
                variableData.value = value;
            }

            /**
             * Set the reference and remove any value
             * @param reference
             */
            function setReference(reference) {
                cachedReference = null;
                delete variableData.value;
                variableData.reference = reference;
            }

            /**
             * @return {boolean}
             */
            function isReference() {
                return variableData.reference !== undefined && variableData.reference !== null;
            }

            /**
             * @return {boolean}
             */
            function isValue(){
                return variableData.value !== undefined && variableData.value !== null;
            }
        }

        /**
         * Uses a list of known names for child properties to provide the child property
         * @param object
         * @returns {*}
         */
        function findChildrenProperty(object) {
            var childNames = ['steps', 'scenarios'];
            for (var i = 0; i < childNames.length; i++) {
                if (object[childNames[i]] !== undefined) {
                    return object[childNames[i]];
                }
            }
            return null;
        }
    });
