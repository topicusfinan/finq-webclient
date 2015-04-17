/**
 * Created by marc.fokkert on 17-4-2015.
 */
angular.module('finqApp.directive')
    .directive('linkify', function () {
        return {
            scope: {},
            restrict: 'A',
            transclude: true,
            templateUrl: 'views/directives/linkify.html',
            link: function(scope, element){
                var attr = element[0].attributes[0];
                scope.$watch(function(){return $(element).attr('linkify');}, function(newVal){
                    scope.link = '#' + newVal;
                });
            }
        };
    });
