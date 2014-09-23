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
    .service('module', ['$rootScope','EVENTS','MODULES',function ($rootScope,EVENTS,MODULES) {
        var moduleServices = {};

        this.linkModule = function(moduleId,moduleService) {
            moduleServices[moduleId] = moduleService;
            if (typeof moduleService.initialize === 'function') {
                moduleService.initialize();
            }
        };

        this.handleEvent = function(event,eventData) {
            angular.forEach(moduleServices,function(service) {
                service.handle(event,eventData);
            });
        };

        this.updateSectionBadge = function(section,count) {
            $rootScope.$broadcast(EVENTS.SCOPE.SECTION_NOTIFICATIONS_UPDATED,{
                section: section,
                count: count
            });
        };

        this.updateModuleBadge = function(module,count) {
            $rootScope.$broadcast(EVENTS.SCOPE.MODULE_NOTIFICATIONS_UPDATED,{
                module: module,
                count: count
            });
        };

        this.setCurrentSection = function(section) {
            var module = MODULES[section.id.split('.')[0]];
            $rootScope.$broadcast(EVENTS.SCOPE.SECTION_STATE_CHANGED,{
                module: module,
                section: section
            });
        };

    }]);
