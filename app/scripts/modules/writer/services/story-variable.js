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
        this.setupVariables = SetupVariables;
        this.setupVariable = SetupVariable;
        this.setupNode = SetupNode;
        var rootObject;

        /**
         * Look up a variable within a collection (rootObject)
         * @return {*} undefined or the requested variable
         */
        function LookupVariable(id) {
            var result;

            if (rootObject.variables !== undefined) {
                result = CheckNode(rootObject, id);
            } else {
                result = CheckNode(FindChildrenProperty(rootObject), id);
            }

            return result === null ? undefined : result;

            /// Functions
            /**
             * Helper function for CheckNode
             * @param collection Collection of child nodes
             * @param compareId Id to compare to
             * @returns {*}
             */
            function CheckChildren(collection, compareId) {
                for (var i = 0; i < collection.length; i++) {
                    var nodeResult = CheckNode(collection[i], compareId);
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
            function CheckNode(node, compareId) {
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
                var children = FindChildrenProperty(node);
                if (children !== null) {
                    return CheckChildren(children, compareId);
                }
                return null;
            }
        }

        /**
         * @return {null}
         */
        function ResolveReference(id) {
            var referenceVariable = LookupVariable(id);
            if (referenceVariable !== undefined) {
                if (referenceVariable.reference !== undefined) {
                    return ResolveReference(referenceVariable.reference);
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
        function SetupVariables(objectWithVariables) {
            rootObject = objectWithVariables;
            SetupVariablesRec(rootObject, null);
        }

        /**
         * Helper function for SetupVariable
         * @param objectWithVariables (JSON) object with a variable structure
         * @param parent Parent object
         */
        function SetupVariablesRec(objectWithVariables, parent) {
            var i;
            if (objectWithVariables.variables !== undefined) {
                var input = objectWithVariables.variables.input;
                var output = objectWithVariables.variables.output;

                // Set up input and output variables
                for (i = 0; i < input.length; i++) {
                    SetupVariable(input[i], INPUT);
                }
                for (i = 0; i < output.length; i++) {
                    SetupVariable(output[i], OUTPUT);
                }
            }


            // Recursive call
            var children = FindChildrenProperty(objectWithVariables);
            if (children !== null) {
                for (i = 0; i < children.length; i++) {
                    SetupVariablesRec(children[i], objectWithVariables);
                }
            }

            // Register methods
            SetupNode(objectWithVariables, parent);
        }

        /**
         * Bind helper functions to a node
         * @param node An object with variables
         * @param parent Parent object to be linked
         */
        function SetupNode(node, parent) {
            node.getInputVariables = GetInputVariables;
            node.getOutputVariables = GetOutputVariables;
            node.getParent = GetParent;

            function GetInputVariables() {
                return node.variables.input;
            }

            function GetOutputVariables() {
                return node.variables.output;
            }

            function GetParent() {
                return parent;
            }
        }

        /**
         * Bind helper functions to variable
         * @param variableData Variable data
         * @param inputOutput Whether the variable is input or output
         */
        function SetupVariable(variableData, inputOutput) {
            var cachedReference = null;
            // Register methods
            variableData.getName = GetName;
            variableData.isReference = IsReference;
            variableData.isValue = IsValue;
            variableData.getResolvedValue = GetResolvedValue;
            variableData.getResolvedID = GetResolvedID;
            variableData.getVariableClass = GetVariableClass;
            variableData.getActualValue = GetActualValue;
            variableData.getActualID = GetActualID;
            variableData.setActualValue = SetActualValue;
            variableData.setReference = SetReference;

            // Functions
            /**
             * Get the actual unresolved value (no references)
             * @returns {*}
             */
            function GetActualValue() {
                return variableData.value;
            }

            /**
             * Get the actual unresolved id (no references)
             * @returns {*}
             */
            function GetActualID() {
                return variableData.id;
            }

            /**
             * Get the actual unresolved value, the resolved value, or the name of the resolved value
             * Will only return the name on a referenced value, if not a reference it will return undefined (actual value)
             * @returns {*}
             */
            function GetResolvedValue() {
                if (IsReference()) {
                    var variable = ResolveReference(variableData.reference);
                    if (variable !== undefined) {
                        return variable.getResolvedValue() || variable.getName();
                    }
                    return variable;
                }
                return GetActualValue();
            }

            /**
             * Get the ID of the variable which value is displayed by GetResolvedValue
             * @return {*}
             */
            function GetResolvedID() {
                if (IsReference()) {
                    var variable = ResolveReference(variableData.reference);
                    if (variable !== undefined) {
                        return variable.getResolvedID();
                    }
                    return variable;
                }
                return GetActualID();
            }

            function GetName() {
                return variableData.name;
            }

            /**
             * @return {string}
             */
            function GetVariableClass() {
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
            function SetActualValue(value) {
                cachedReference = null;
                delete variableData.reference;
                variableData.value = value;
            }

            /**
             * Set the reference and remove any value
             * @param reference
             */
            function SetReference(reference) {
                cachedReference = null;
                delete variableData.value;
                variableData.reference = reference;
            }

            /**
             * @return {boolean}
             */
            function IsReference() {
                return variableData.reference !== undefined && variableData.reference !== null;
            }

            /**
             * @return {boolean}
             */
            function IsValue(){
                return variableData.value !== undefined && variableData.value !== null;
            }
        }

        /**
         * Uses a list of known names for child properties to provide the child property
         * @param object
         * @returns {*}
         * @constructor
         */
        function FindChildrenProperty(object) {
            var childNames = ['steps', 'scenarios'];
            for (var i = 0; i < childNames.length; i++) {
                if (object[childNames[i]] !== undefined) {
                    return object[childNames[i]];
                }
            }
            return null;
        }
    });
