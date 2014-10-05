'use strict';

/**
 * @ngdoc overview
 * @name finqApp.runner
 * @description
 * # FinqApp Runner
 *
 * The runner module contains all controllers, services, directives and filters that are only
 * applicable to the runner section of the Finq application.
 */
angular.module('finqApp.runner', ['ngRoute']).config(['$routeProvider',function($routeProvider) {
    $routeProvider.when('/runner/available', {
        templateUrl: '/views/runner/available.html',
        controller: 'AvailableCtrl',
        controllerAs: 'available'
    }).when('/runner/running', {
        templateUrl: '/views/runner/running.html',
        controller: 'RunningCtrl',
        controllerAs: 'running'
    });
}]);
