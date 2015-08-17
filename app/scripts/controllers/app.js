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
    .controller('AppCtrl', function ($route, $scope, $translate, EVENTS, $config, $page, $setup) {
        var that = this;
        this.title = 'Finq';

        $setup.initialize();

        $scope.$on(EVENTS.SCOPE.CONFIG_LOADED, function (event, serverConfigData) {
            that.title = serverConfigData.title;
        });

        $scope.$on(EVENTS.SCOPE.SECTION_STATE_CHANGED, function (event, moduleInfo) {
            // update the page title
            $page.setActiveSection(moduleInfo.module, moduleInfo.section);
            $translate(moduleInfo.section.id + '.TITLE').then(function (translatedValue) {
                that.title = $page.getPageTitle($config.server().title, translatedValue);
            });
        });
    });
