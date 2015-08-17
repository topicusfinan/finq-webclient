/*global $: false */
'use strict';
/**
 * @ngdoc function
 * @name finqApp.service:sidebar
 * @description
 * # Sidebar service
 *
 * Provides interaction for the sidebar. Components can use this service to register directives.
 */
angular.module('finqApp.runner.service')
    .service('$sidebar', function ($rootScope,STATE) {
        var directive = null, expanded = false;

        this.setDirective = setDirective;
        this.getStatus = getStatus;
        this.expand = expand;
        this.collapse = collapse;
        this.get = get;
        this.getDirective = getDirective;

        /**
         * @return {number} -1 in case no sidebar is available, 1 in case it is available
         * and expanded, 0 in case it is available and not expanded.
         */
        function getStatus() {
            return directive === null ? STATE.SIDEBAR.HIDDEN : (expanded ? STATE.SIDEBAR.EXPANDED : STATE.SIDEBAR.COLLAPSED);
        }

        function expand() {
            expanded = true;
        }

        function collapse()  {
            expanded = false;
        }

        function getDirective() {
            return directive;
        }

        /**
         * Sets the current directive
         * @param attributes A key value pair with attribute=value
         */
        function setDirective(attributes) {
            directive = attributes;
        }

        function get(providedScope) {
            var viewBagName = 'bag';
            var scope = providedScope || $rootScope;
            var element = $('<div></div>');
            scope[viewBagName] = directive;

            for (var key in directive) {
                if (directive.hasOwnProperty(key)) {
                    element.attr(key, viewBagName + '["' + key + '"]');
                }
            }

            return {
                template: element,
                scope: scope
            };
        }
    });
