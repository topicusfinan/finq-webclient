'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:sectionState
 * @description
 * # Section state service
 *
 * Manage state and state indicators for sections. This can be used to update counters, badges
 * and other forms of state indicators for sections and modules.
 */
angular.module('finqApp.service')
    .service('sectionState', ['$rootScope','EVENTS','MODULES',function ($rootScope,EVENTS,MODULES) {
        var moduleServices = {};

        this.linkModule = function(moduleId,moduleService) {
            moduleServices[moduleId] = moduleService;
            moduleService.initialize();
        };

        this.handleEvent = function(event,eventData) {
            angular.forEach(moduleServices,function(service) {
                service.handle(event,eventData);
            });
        };

        this.updateSectionBadge = function(section) {
            var module = MODULES[section.id.split('.')[0]];
            $rootScope.$broadcast(EVENTS.SCOPE.SECTION_BADGE_UPDATED,{
                module: module,
                section: section
            });
        };

        this.updateModuleBadge = function(module) {
            $rootScope.$broadcast(EVENTS.SCOPE.MODULE_BADGE_UPDATED,module);
        };

        this.setCurrentSection = function(section) {
            var module = MODULES[section.id.split('.')[0]];
            // broadcast a navigation updated event to inform other controllers
            $rootScope.$broadcast(EVENTS.SCOPE.SECTION_STATE_CHANGED,{
                module: module,
                section: section
            });
        };

    }]);
