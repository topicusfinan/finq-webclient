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
        this.setupVariables = SetupVariables;
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
                result = CheckChild(rootObject, id);
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
                var childResult, j;
                var input = node.variables.input;
                var output = node.variables.output;
                for (j = 0; j < input.length; j++) {
                    childResult = CheckChild(input[j], compareId);
                    if (childResult !== null) {
                        return childResult;
                    }
                }
                for (j = 0; j < output.length; j++) {
                    childResult = CheckChild(output[j], compareId);
                    if (childResult !== null) {
                        return childResult;
                    }
                }
            }

            /**
             * Helper function for CheckNode. Does not evaluate the node provided.
             * @param node Node with children to evaluate
             * @param compareId Id to compare to
             * @returns {*}
             */
            function CheckChild(node, compareId) {
                var children = FindChildrenProperty(node);
                if (node.id === compareId) {
                    return node;
                } else if (children !== null) {
                    return CheckChildren(children);
                }
                return null;
            }
        }

        function ResolveReference(variable) {
            var referenceVariable = LookupVariable(variable.id);
            if (referenceVariable.value !== undefined) {
                return referenceVariable.value;
            }
            return ResolveReference(referenceVariable.reference);
        }


        /**
         * Bind helper functions to an object structure with variables
         * @param objectWithVariables (JSON) object with a variable structure
         */
        function SetupVariables(objectWithVariables) {
            rootObject = objectWithVariables;
            SetupVariablesRec(rootObject, null);

            /**
             * Helper function for SetupVariable
             * @param objectWithVariables (JSON) object with a variable structure
             * @param parent Parent object
             */
            function SetupVariablesRec(objectWithVariables, parent) {
                var i;
                var input = objectWithVariables.variables.input;
                var output = objectWithVariables.variables.output;

                // Set up input and output variables
                for (i = 0; i < input.length; i++) {
                    SetupVariable(input[i]);
                }
                for (i = 0; i < output.length; i++) {
                    SetupVariable(output[i]);
                }

                // Recursive call
                var children = FindChildrenProperty(objectWithVariables);
                if (children !== null) {
                    for (i = 0; i < children.length; i++) {
                        SetupVariablesRec(children[i], objectWithVariables);
                    }
                }

                // Register methods
                objectWithVariables.getInputVariables = GetInputVariables;
                objectWithVariables.getOutputVariables = GetOutputVariables;
                objectWithVariables.getParent = GetParent;

                function GetInputVariables() {
                    return objectWithVariables.variables.input;
                }

                function GetOutputVariables() {
                    return objectWithVariables.variables.output;
                }

                function GetParent() {
                    return parent;
                }
            }

            /**
             * Bind helper functions to variable
             * @param variableData Variable data
             */
            function SetupVariable(variableData) {
                // Register methods
                variableData.getName = GetName;
                variableData.isReference = IsReference;
                variableData.getResolvedValue = GetResolvedValue;
                variableData.getActualValue = GetActualValue;
                variableData.setActualValue = SetActualValue;
                variableData.setReference = SetReference;

                // Functions
                function GetActualValue() {
                    return variableData.value;
                }

                function GetResolvedValue() {
                    if (IsReference()) {
                        var variable = LookupVariable(variableData.reference);
                        if (variable !== undefined) {
                            return variable.getActualValue();
                        }
                        return variable;
                    } else {
                        return GetActualValue();
                    }
                }

                function GetName() {
                    return variableData.name;
                }

                function SetActualValue(value) {
                    delete variableData.reference;
                    variableData.value = value;
                }

                function SetReference(reference) {
                    delete variableData.value;
                    variableData.reference = reference;
                }

                /**
                 * @return {boolean}
                 */
                function IsReference() {
                    return variableData.reference !== undefined && variableData.reference !== null;
                }
            }
        }

        /**
         * Uses a list of known names for child properties to provide the child property
         * @param object
         * @returns {*}
         * @constructor
         */
        function FindChildrenProperty(object) {
            var childNames = ['steps'];
            for (var i = 0; i < childNames.length; i++) {
                if (object[childNames[i]] !== undefined) {
                    return object[childNames[i]];
                }
            }
            return null;
        }
    });
