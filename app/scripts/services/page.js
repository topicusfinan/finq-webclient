'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:page
 * @description
 * # Application page factory
 *
 * Creates page level informaton based on current application state.
 */
angular.module('finqApp.service')
    .factory('page', function () {
        var activeModule = null;
        var activeSection = null;

        this.getPageTitle = function(appTitle,controllerTitle) {
            var detailedTitle = controllerTitle !== undefined ? controllerTitle : '';
            return appTitle + (detailedTitle.length !== 0 ? ' - '+detailedTitle : '');
        };

        return {
            setActiveSection: function(targetModule,targetSection) {
                activeModule = targetModule.id;
                activeSection = targetSection.id;
            },
            getPageTitle: this.getPageTitle,
            getActiveSection: function() {
                return {
                    moduleId: activeModule,
                    sectionId: activeSection
                };
            }
        };
    });
