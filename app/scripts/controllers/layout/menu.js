/**
 * Created by c.kramer on 8/15/2014.
 */
'use strict';

/**
 * @ngdoc overview
 * @name finqApp:MenuCtrl
 * @description
 * # Menu controller
 *
 * The main controller for the navigation menu that is displayed on the left side of the application. This
 * controller takes care of badges, highlights and selections within the menu, and allows the user navigate
 * to different sections within the application.
 */
angular.module('finqApp')
    .controller('MenuCtrl', [
        '$scope',
        '$translate',
        'MODULES',
        'EVENTS',
        'page',
        function ($scope,$translate,MODULES,EVENTS,pageFactory) {
        var that = this;
        this.modules = [];
        this.sections = [];
        this.activeModuleName = '';
        var activeSection = pageFactory.getActiveSection();

        // private method for the rebuilding of the section list
        var rebuildSectionList = function(sectionList,activeSectionId) {
            angular.forEach(sectionList, function(section) {
                var sectionIsActive = activeSectionId === section.id;
                $translate(section.id+'.TITLE').then(function (translatedTitle) {
                    that.sections.push({
                        id: section.id,
                        title: translatedTitle,
                        active: sectionIsActive
                    });
                });
            });
        };

        // initial load of the modules and the active section
        angular.forEach(MODULES, function(module) {
            var moduleIsActive = activeSection.moduleId === module.id;
            $translate(module.id+'.TITLE').then(function (translatedTitle) {
                that.modules.push({
                    id: module.id,
                    title: translatedTitle,
                    active: moduleIsActive
                });
                if (moduleIsActive) {
                    that.activeModuleName = translatedTitle;
                    rebuildSectionList(module.sections,activeSection.sectionId);
                }
            });
        });

        // handle navigation changes by updating the active module and reloading or updating the section listing
        $scope.$on(EVENTS.NAVIGATION_UPDATED,function(event,newActiveModule,newActiveSection) {
            if (activeSection.moduleId !== newActiveModule.id) {
                // update the active module in case it changed
                angular.forEach(that.modules, function(module) {
                    if (module.id === activeSection.moduleId && module.active) {
                        module.active = false;
                    } else if (module.id === newActiveModule.id) {
                        module.active = true;
                        rebuildSectionList(module.sections,newActiveSection.id);
                    }
                });
            } else if (activeSection.sectionId !== newActiveSection.id) {
                // update the active section in case it changed
                angular.forEach(that.sections, function(section) {
                    if (section.id === activeSection.sectionId && section.active) {
                        section.active = false;
                    } else if (section.id === newActiveSection.id) {
                        section.active = true;
                    }
                });
            }
            // set the updated section and module for the next time we navigate
            activeSection = {
                sectionId: newActiveSection.id,
                moduleId: newActiveModule.id
            };
        });
    }]);