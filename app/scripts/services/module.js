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
    .service('$module', function ($rootScope, EVENTS, MODULES, $selectedItem) {
        var moduleServices = {};

        this.linkModule = function (module, moduleSpecificService) {
            moduleServices[module.id] = moduleSpecificService;
            if (typeof moduleSpecificService.initialize === 'function') {
                moduleSpecificService.initialize();
            }
        };

        this.handleEvent = function (event, eventData) {
            angular.forEach(moduleServices, function (service) {
                service.handle(event, eventData);
            });
        };

        this.updateSectionBadge = function (section, identifiers, add) {
            $rootScope.$broadcast(EVENTS.SCOPE.SECTION_NOTIFICATIONS_UPDATED, {
                id: section.id,
                identifiers: identifiers,
                add: add
            });
        };

        this.updateModuleBadge = function (module, identifiers, add) {
            $rootScope.$broadcast(EVENTS.SCOPE.MODULE_NOTIFICATIONS_UPDATED, {
                id: module.id,
                identifiers: identifiers,
                add: add
            });
        };

        this.setCurrentSection = function (section) {
            var module = MODULES[section.id.split('.')[0]];
            $rootScope.$broadcast(EVENTS.SCOPE.SECTION_STATE_CHANGED, {
                module: module,
                section: section
            });
            $selectedItem.setGroupPrefix(section.id);
        };

    });
