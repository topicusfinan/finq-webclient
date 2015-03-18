/*global $: false */
'use strict';
/**
 * Created by marc.fokkert on 6-3-2015.
 */
angular.module('finqApp.runner.service')
    .service('sidebar', function ($rootScope) {
        var directive, visible;
        clean();

        this.setDirective = setDirective;
        this.clean = clean;
        this.hasSidebar = hasSidebar;
        this.getSidebar = getSidebar;
        this.getDirective = getDirective;

        /**
         * @return {boolean}
         */
        function hasSidebar() {
            return directive !== null;
        }

        function clean() {
            directive = null;
            visible = false;
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

        function getSidebar(providedScope) {
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
