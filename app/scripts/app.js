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
 *
 * Copyright (C) 2014 Christian Kramer
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
angular
    .module('finqApp', [
        'ngRoute',
        'ui.router',
        'ngAnimate',
        'angular-md5',
        'siyfion.sfTypeahead',

        'finqApp.service',
        'finqApp.directive',
        'finqApp.filter',
        'finqApp.controller',

        'finqApp.runner',
        'finqApp.organizer',
        'finqApp.writer',

        'finqApp.translate'
    ]).config(['$routeProvider','$stateProvider',function($routeProvider,$stateProvider) {
        $routeProvider.otherwise({
            redirectTo: '/runner'
        });
        $stateProvider.state('intro', {
            templateUrl: 'views/intro/intro.html'
        }).state('intro.login', {
            templateUrl: 'views/intro/login.html'
        }).state('intro.loading', {
            templateUrl: 'views/intro/preloader.html'
        }).state('authorized', {
            templateUrl: 'views/layout.html',
            controller: 'LayoutCtrl as layout'
        });
    }]);

angular.module('finqApp.service',[]);
angular.module('finqApp.directive',[]);
angular.module('finqApp.filter',[]);
angular.module('finqApp.controller',[]);
