'use strict';

/**
 * @ngdoc overview
 * @name finqApp.directives:OutsideClick
 * @description
 * # Handle outside clicks for elements
 *
 * Trigger the execution of a function when the user clicks on the document but not on a specific element.
 * This directive can be used instead of a blur event in cases where the $digest cycle triggers the blur
 * event more often than intended by the user.
 */
angular.module('finqApp.directive')
    .directive('outsideClick', ['$document', function( $document){
        return {
            link: function( $scope, $element, $attributes ){
                var scopeExpression = $attributes.outsideClick,
                    onDocumentClick = function(event){
                        var isChild = $element.find(event.target).length > 0;

                        if(!isChild) {
                            $scope.$apply(scopeExpression);
                        }
                    };

                $document.on('click', onDocumentClick);

                $element.on('$destroy', function() {
                    $document.off('click', onDocumentClick);
                });
            }
        };
    }]);
