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
        '$location',
        'MODULES',
        'EVENTS',
        'page',
        function ($scope, $translate, $timeout, $location, MODULES, EVENTS, pageFactory) {
            var that = this,
                activeSection = pageFactory.getActiveSection(),
                sectionBadge = {},
                moduleBadge = {};

            this.modules = [];
            this.sections = [];
            this.activeModuleName = '';

            // private method for the rebuilding of the section list
            var rebuildSectionList = function (sectionList, activeSectionId) {
                that.sections = [];
                angular.forEach(sectionList, function (section) {
                    var sectionIsActive = activeSectionId === section.id;
                    var sectionIndex = that.sections.length;
                    if (sectionIsActive) {
                        sectionBadge[section.id] = [];
                        updateSectionBadge(section.id, 0);
                    }
                    that.sections.push({
                        id: section.id,
                        title: '',
                        url: moduleToUrl(section),
                        badge: sectionBadge[section.id] !== undefined ? sectionBadge[section.id].length : 0,
                        active: sectionIsActive
                    });
                    // translations can be loaded after the menu is setup, so we ensure display values are up to date
                    $translate(section.id + '.TITLE').then(function (translatedTitle) {
                        that.sections[sectionIndex].title = translatedTitle;
                    });
                });
            };

            var moduleToUrl = function (sectionOrModule) {
                return '/' + sectionOrModule.id.toLowerCase().replace('.', '/');
            };

            // initial load of the modules and the active section
            angular.forEach(MODULES, function (module) {
                var moduleIndex = that.modules.length;
                that.modules[moduleIndex] = {
                    id: module.id,
                    title: '',
                    url: moduleToUrl(module),
                    badge: moduleBadge[module.id] !== undefined ? moduleBadge[module.id] : 0,
                    active: false,
                    sections: module.sections
                };
                // translations can be loaded after the menu is setup, so we ensure display values are up to date
                $translate(module.id + '.TITLE').then(function (translatedTitle) {
                    if (activeSection.moduleId === module.id) {
                        that.activeModuleName = translatedTitle;
                    }
                    that.modules[moduleIndex].title = translatedTitle;
                });
            });

            $scope.go = function (path) {
                $location.path(path);
            };

            // handle navigation changes by updating the active module and reloading or updating the section listing
            $scope.$on(EVENTS.SCOPE.SECTION_STATE_CHANGED, function (event, updateInfo) {
                var newActiveModule = updateInfo.module;
                var newActiveSection = updateInfo.section;
                if (activeSection.moduleId !== newActiveModule.id) {
                    // update the active module in case it changed
                    angular.forEach(that.modules, function (module) {
                        if (module.id === activeSection.moduleId && module.active) {
                            module.active = false;
                        } else if (module.id === newActiveModule.id) {
                            module.active = true;
                            updateModuleBadge(module.id, 0);
                            that.activeModuleName = module.title;
                            rebuildSectionList(module.sections, newActiveSection.id);
                        }
                    });
                } else if (activeSection.sectionId !== newActiveSection.id) {
                    // update the active section in case it changed
                    angular.forEach(that.sections, function (section) {
                        if (section.id === activeSection.sectionId && section.active) {
                            section.active = false;
                        } else if (section.id === newActiveSection.id) {
                            section.active = true;
                            sectionBadge[updateInfo.section.id] = [];
                            updateSectionBadge(section.id, 0);
                        }
                    });
                }
                // set the updated section and module for the next time we navigate
                activeSection = {
                    sectionId: newActiveSection.id,
                    moduleId: newActiveModule.id
                };
            });

            $scope.$on(EVENTS.SCOPE.SECTION_NOTIFICATIONS_UPDATED, function (event, updateInfo) {
                if (activeSection.sectionId !== updateInfo.id) {
                    updateNotificationList(sectionBadge, updateInfo);
                    updateSectionBadge(updateInfo.id, sectionBadge[updateInfo.id].length);
                }
            });

            $scope.$on(EVENTS.SCOPE.MODULE_NOTIFICATIONS_UPDATED, function (event, updateInfo) {
                if (activeSection.moduleId !== updateInfo.id) {
                    updateNotificationList(moduleBadge, updateInfo);
                    updateModuleBadge(updateInfo.id, moduleBadge[updateInfo.id].length);
                }
            });

            var updateNotificationList = function (list, updateInfo) {
                var i, j;
                for (i = 0; i < updateInfo.identifiers.length; i++) {
                    if (list[updateInfo.id] === undefined) {
                        list[updateInfo.id] = [];
                    } else {
                        for (j = 0; j < list[updateInfo.id].length; j++) {
                            if (list[updateInfo.id][j] === updateInfo.identifiers[i]) {
                                list[updateInfo.id].splice(j--, 1);
                                break;
                            }
                        }
                    }
                    if (updateInfo.add) {
                        list[updateInfo.id].push(updateInfo.identifiers[i]);
                    }
                }
            };

            var updateSectionBadge = function (sectionId, targetCount) {
                angular.forEach(that.sections, function (section) {
                    if (section.id === sectionId) {
                        section.badge = targetCount;
                    }
                });
            };

            var updateModuleBadge = function (moduleId, targetCount) {
                angular.forEach(that.modules, function (module) {
                    if (module.id === moduleId) {
                        module.badge = targetCount;
                    }
                });
            };

        }]);
