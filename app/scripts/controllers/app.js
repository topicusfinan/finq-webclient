'use strict';

/**
 * @ngdoc overview
 * @name finqApp:AppCtrl
 * @description
 * # Application Controller
 *
 * The main controller for the Finq application, which handles the creation and orchestration
 * of the application layout and main controllers.
 */
angular.module('finqApp')
    .controller('AppCtrl', [

        '$state',
        '$scope',
        '$route',
        'config',
        'page',
        'EVENTS',

        function ($state,$scope,$route,config,pageFactory,EVENTS) {
            var that = this;
            this.title = 'Finq';

            $route.current = '/';
            $scope.template = {
                menu: 'views/menu.html',
                header: 'views/header.html'
            };

            $state.go('intro.loading');

            $scope.$on(EVENTS.CONFIG_LOADED,function(){
                that.title = config.appTitle();
            });
            $scope.$on(EVENTS.PAGE_CONTROLLER_UPDATED,function(event,moduleInfo) {
                // update the page title
                that.pageTitle = pageFactory.setActiveSection(config.title(),moduleInfo.module,moduleInfo.section);
                // broadcast a navigation updated event to inform other controllers
                $scope.$broadcast(EVENTS.NAVIGATION_UPDATED,moduleInfo.module,moduleInfo.section);
            });
        }
    ]);
