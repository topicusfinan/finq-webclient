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
        'ui.router',

        'finqApp.services',
        'finqApp.directives',
        'finqApp.filters',

        'finqApp.reporter',
        'finqApp.runner',
        'finqApp.organizer',
        'finqApp.writer',

        'finqApp.mock',
        'finqApp.translate',
    ]).config(['$routeProvider','$stateProvider',function($routeProvider,$stateProvider) {
        $routeProvider.otherwise({
            redirectTo: '/runner/available'
        });
        $stateProvider.state('loaded', {
            templateUrl: 'views/layout.html'
        }).state('loading', {
            templateUrl: 'views/preloader.html'
        });
    }]);

angular.module('finqApp.services',[]);
angular.module('finqApp.directives',[]);
angular.module('finqApp.filters',[]);