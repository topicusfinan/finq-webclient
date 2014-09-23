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
angular.module('finqApp.controller')
    .controller('MenuCtrl', [
        '$scope',
        '$translate',
        '$timeout',
        'MODULES',
        'EVENTS',
        'page',
        function ($scope,$translate,$timeout,MODULES,EVENTS,pageFactory) {
        var that = this,
            activeSection = pageFactory.getActiveSection(),
            sectionCount = {};

        this.modules = [];
        this.sections = [];
        this.activeModuleName = '';

        // delay the loaded indication to allow for appear effects
        $timeout(function() {
            that.loaded = true;
        },10);

        this.getSectionCount = function(sectionId) {
            if (sectionCount[sectionId]) {
                return sectionCount[sectionId];
            }
            return '';
        };

        // private method for the rebuilding of the section list
        var rebuildSectionList = function(sectionList,activeSectionId) {
            that.sections = [];
            angular.forEach(sectionList, function(section) {
                var sectionIsActive = activeSectionId === section.id;
                var sectionIndex = that.sections.length;
                that.sections.push({
                    id: section.id,
                    title: '',
                    active: sectionIsActive
                });
                // translations can be loaded after the menu is setup, so we ensure display values are up to date
                $translate(section.id+'.TITLE').then(function (translatedTitle) {
                    that.sections[sectionIndex].title = translatedTitle;
                });
            });
        };

        // initial load of the modules and the active section
        angular.forEach(MODULES, function(module) {
            var moduleIndex = that.modules.length;
            that.modules[moduleIndex] = {
                id: module.id,
                title: '',
                active: false,
                sections: module.sections
            };
            // translations can be loaded after the menu is setup, so we ensure display values are up to date
            $translate(module.id+'.TITLE').then(function (translatedTitle) {
                if (activeSection.moduleId === module.id) {
                    that.activeModuleName = translatedTitle;
                }
                that.modules[moduleIndex].title = translatedTitle;
            });
        });

        // handle navigation changes by updating the active module and reloading or updating the section listing
        $scope.$on(EVENTS.SCOPE.SECTION_STATE_CHANGED,function(event,updateInfo) {
            var newActiveModule = updateInfo.module;
            var newActiveSection = updateInfo.section;
            if (activeSection.moduleId !== newActiveModule.id) {
                // update the active module in case it changed
                angular.forEach(that.modules, function(module) {
                    if (module.id === activeSection.moduleId && module.active) {
                        module.active = false;
                    } else if (module.id === newActiveModule.id) {
                        module.active = true;
                        that.activeModuleName = module.title;
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

        $scope.$on(EVENTS.SCOPE.SUBSECTION_COUNT_UPDATED,function(event,updateInfo) {
            sectionCount[updateInfo.sectionId] = updateInfo.count;
        });

    }]);
