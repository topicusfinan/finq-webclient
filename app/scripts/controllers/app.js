'use strict';

/**
 * @ngdoc overview
 * @name finqApp.controller:AppCtrl
 * @description
 * # Application Controller
 *
 * The main controller for the Finq application, which handles the creation and orchestration
 * of the application layout and main controllers.
 */
angular.module('finqApp.controller')
    .controller('AppCtrl', [

        '$state',
        '$scope',
        '$route',
        '$translate',
        'config',
        'page',
        'EVENTS',

        function ($state,$scope,$route,$translate,configProvider,pageFactory,EVENTS) {
            var that = this;
            this.title = 'Finq';
            this.searchQuery = '';

            $state.go('intro.loading');

            $scope.$on(EVENTS.CONFIG_LOADED,function(event, serverConfigData){
                that.title = serverConfigData.title;
            });
            $scope.$on(EVENTS.PAGE_CONTROLLER_UPDATED,function(event,moduleInfo) {
                // update the page title
                pageFactory.setActiveSection(moduleInfo.module,moduleInfo.section);
                $translate(moduleInfo.section.id+'.TITLE').then(function (translatedValue) {
                    that.title = pageFactory.getPageTitle(configProvider.server().title,translatedValue);
                });
                // broadcast a navigation updated event to inform other controllers
                $scope.$broadcast(EVENTS.NAVIGATION_UPDATED,{
                    module: moduleInfo.module,
                    section: moduleInfo.section
                });
            });
            $scope.$on(EVENTS.SEARCH_UPDATED,function(event, query){
                that.searchQuery = query;
            });
        }
    ]);
