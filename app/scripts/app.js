'use strict';

/**
 * @ngdoc overview
 * @name finqApp
 * @description
 * # Application Controller
 *
 * The main module of the application that contains the central routing and submodules. When implementing
 * new controllers in sub-modules that require a routing, please make sure to add the routing using the
 * sub-module instead of the main application module.
 */
angular
    .module('finqApp', [
        'ngRoute',

        'finqApp.services',
        'finqApp.directives',
        'finqApp.filters',
        'finqApp.translations',

        'finqApp.reporter',
        'finqApp.runner',
        'finqApp.organizer',
        'finqApp.writer',

        'finqApp.mock'
    ]).config(['$routeProvider',function($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/runner/available'
        });
    }]);

angular.module('finqApp.services',[]);
angular.module('finqApp.directives',[]);
angular.module('finqApp.filters',[]);