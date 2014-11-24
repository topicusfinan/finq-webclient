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
angular.module('finqApp.runner', [
        'ngRoute',

        'finqApp.runner.service',
        'finqApp.runner.controller'
    ]).config(['$routeProvider',function($routeProvider) {
    $routeProvider.when('/runner/available', {
        templateUrl: '/views/modules/runner/available.html',
        controller: 'AvailableCtrl',
        controllerAs: 'available'
    }).when('/runner/running', {
        templateUrl: '/views/modules/runner/running.html',
        controller: 'RunningCtrl',
        controllerAs: 'running'
    }).when('/runner/history', {
        templateUrl: '/views/modules/runner/history.html',
        controller: 'HistoryCtrl',
        controllerAs: 'history'
    }).when('/runner', {
        redirectTo: '/runner/available'
    });

}]);

angular.module('finqApp.runner.service',[]);
angular.module('finqApp.runner.controller',[]);
