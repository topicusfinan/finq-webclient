'use strict';
/**
 * Created by marc.fokkert on 17-3-2015.
 */
angular.module('finqApp.directive')
    .directive('variableModal', function () {
        return {
            scope: {},
            restrict: 'A',
            link: function (scope, element) {
                element.addClass('modal-wrapper');
            },
            controller: 'variableModalCtrl',
            controllerAs: 'variableModalCtrl',
            templateUrl: 'views/modules/writer/directives/variable-modal.html'
        };
    })
    .controller('variableModalCtrl', function (arrayOperations) {
        var that = this;
        this.title = 'test title';
        this.description = 'test description';
        this.simple = false;
        this.visibleTab = 0;
        this.removeTab = removeTab;
        this.addTab = addTab;

        var emptyTabTemplate = [{name: 'test'}, {name: 'foo'}];

        this.tabs = [
            [
                {name: 'test', value: 'foobar'}
            ],
            [
                {name: 'test', value: 'foobar'}
            ]
        ];

        function removeTab(index) {
            arrayOperations.removeItem(that.tabs, index);
            // delete behavior (which tab gets selected after a delete)
            if (that.visibleTab > 1){
                that.visibleTab--;
            } else {
                that.visibleTab = 0;
            }
        }

        function addTab() {
            that.tabs.push(angular.copy(emptyTabTemplate));
            that.visibleTab = that.tabs.length - 1;
        }


    });
