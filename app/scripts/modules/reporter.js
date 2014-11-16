'use strict';

/**
 * @ngdoc overview
 * @name finqApp.reporter
 * @description
 * # FinqApp Reporter
 *
 * The reporter module contains all controllers, services, directives and filters that are only
 * applicable to the reports section of the Finq application.
 */
angular.module('finqApp.reporter', [
    'ngRoute',

    'finqApp.reporter.service',
    'finqApp.reporter.controller'
]).config(['$routeProvider',function($routeProvider) {
    $routeProvider.when('/reporter/history', {
        templateUrl: '/views/modules/reporter/history.html',
        controller: 'HistoryCtrl',
        controllerAs: 'histort'
    }).when('/reporter', {
        redirectTo: '/reporter/history'
    });
}]);

angular.module('finqApp.reporter.service',[]);
angular.module('finqApp.reporter.controller',[]);
