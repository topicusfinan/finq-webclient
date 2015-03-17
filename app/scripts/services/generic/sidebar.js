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
        this.setVisible = setVisible;
        this.toggleVisible = toggleVisible;
        this.getVisible = getVisible;
        this.hasVisibleSidebar = hasVisibleSidebar;

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

        function hasVisibleSidebar(){
            return hasSidebar() && getVisible();
        }


        /**
         * Sets the current directive
         * @param attributes A key value pair with attribute=value
         */
        function setDirective(attributes) {
            directive = attributes;
        }

        function setVisible(visibility){
            visible = visibility;
        }

        function toggleVisible(){
            visible = !visible;
        }

        function getVisible(){
            return visible;
        }

        function getSidebar(providedScope) {
            var viewBagName = 'bag';
            var scope = providedScope || $rootScope;
            var element = $('<aside></aside>');
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
