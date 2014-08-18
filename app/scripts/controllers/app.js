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

        '$translate',
        '$scope',
        '$route',
        'config',
        'page',
        'EVENTS',
        '$translatePartialLoader',

        function ($translate,$scope,$route,configProvider,pageFactory,EVENTS,$translatePartialLoader) {
        $route.current = '/';
        $scope.pageTitle = 'Finq';

        $scope.template = {
            layout: 'views/layout.html',
            menu: 'views/menu.html',
            header: 'views/header.html'
        };

        $scope.$on(EVENTS.PAGE_CONTROLLER_UPDATED,function(event,moduleInfo) {
            configProvider.load(function(appConfiguration) {
                // update the page title
                $scope.pageTitle = pageFactory.setActiveSection(appConfiguration.title,moduleInfo.module,moduleInfo.section);
                // load the translations file associated with the section controller
                var controllerTranslations = moduleInfo.section.id.toLowerCase().replace('.','/');
                $translatePartialLoader.addPart(controllerTranslations);
                $translate.refresh();
                // broadcast a navigation updated event to inform other controllers
                $scope.$broadcast(EVENTS.NAVIGATION_UPDATED,moduleInfo.module,moduleInfo.section);
            });
        });
  }]);
