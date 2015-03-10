/**
 * Created by marc.fokkert on 6-3-2015.
 */
angular.module('finqApp.runner.service')
    .service('sidebar', function ($rootScope) {
        var directive, visible;
        Clean();

        this.setDirective = SetDirective;
        this.clean = Clean;
        this.hasSidebar = HasSidebar;
        this.getSidebar = GetSidebar;
        this.getDirective = GetDirective;
        this.setVisible = SetVisible;
        this.toggleVisible = ToggleVisible;
        this.getVisible = GetVisible;

        /**
         * @return {boolean}
         */
        function HasSidebar() {
            return directive !== null;
        }

        function Clean() {
            directive = null;
            visible = false;
        }

        function GetDirective() {
            return directive;
        }


        /**
         * Sets the current directive
         * @param attributes A key value pair with attribute=value
         */
        function SetDirective(attributes) {
            directive = attributes;
        }

        function SetVisible(visibility){
            visible = visibility;
        }

        function ToggleVisible(){
            visible = !visible;
        }

        function GetVisible(){
            return visible;
        }

        function GetSidebar(providedScope) {
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
            }
        }
    });
