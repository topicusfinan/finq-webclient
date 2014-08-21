'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:page
 * @description
 * # Application page factory
 *
 * Creates page level informaton based on current application state.
 */
angular.module('finqApp.services')
    .factory('page', function () {
        var activeModule;
        var activeSection;
        var that = this;

        this.getPageTitle = function(appTitle,controllerTitle) {
            var detailedTitle = controllerTitle !== undefined ? controllerTitle : '';
            return appTitle + (detailedTitle.length !== 0 ? ' - '+detailedTitle : '');
        };

        return {
            setActiveSection: function(appTitle,targetModule,targetSection) {
                activeModule = targetModule.id;
                activeSection = targetSection.id;
                return that.getPageTitle(appTitle,targetSection.title);
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
