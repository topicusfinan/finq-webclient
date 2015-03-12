/**
 * @ngdoc function
 * @name finqApp.writer.service:storyVariables
 * @description
 * # Story variable service
 *
 *
 *
 */
angular.module('finqApp.writer.service')
    .service('storyVariable', function () {
        this.setupVariables = SetupVariables;
        var rootObject;

        /**
         *
         * @return {Object} undefined or the requested variable
         */
        function LookupVariable(id) {
            var result;

            if (rootObject.variables !== undefined){
                result = CheckNode(rootObject, id);
            } else {
                result = CheckChildren(rootObject, id);
            }

            return result === null ? undefined : result;

            /// Functions
            function CheckChildren(collection, compareId) {
                for (var i = 0; i < collection.length; i++) {
                    var nodeResult = CheckNode(collection[i], compareId);
                    if (nodeResult !== null){
                        return nodeResult;
                    }
                }
                return null;
            }

            function CheckNode(node, compareId){
                var childResult;
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


        // New implementation
        function SetupVariables(objectWithVariables) {
            rootObject = objectWithVariables;
            SetupVariablesRec(rootObject, null);

            function SetupVariablesRec(objectWithVariables, parent) {
                var i;
                var input = objectWithVariables.variables.input;
                var output = objectWithVariables.variables.output;
                for (i = 0; i < input.length; i++) {
                    SetupVariable(input[i], parent);
                }
                for (i = 0; i < output.length; i++) {
                    SetupVariable(output[i], parent);
                }
                var children = FindChildrenProperty(objectWithVariables);
                if (children !== null) {
                    for (i = 0; i < children.length; i++) {
                        SetupVariablesRec(children[i], objectWithVariables);
                    }
                }
            }

            function SetupVariable(variableData, parent) {
                variableData.getName = GetName;
                variableData.isReference = IsReference;
                variableData.getResolvedValue = GetResolvedValue;
                variableData.getActualValue = GetActualValue;
                variableData.setActualValue = SetActualValue;
                variableData.setReference = SetReference;
                variableData.parent = parent;

                function GetActualValue() {
                    return variableData.value;
                }

                function GetResolvedValue() {
                    if (IsReference()) {
                        var variable = LookupVariable(variableData.reference);
                        if (variable !== undefined){
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
