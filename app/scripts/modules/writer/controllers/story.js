/*global Bloodhound:false */
'use strict';

/**
 * @ngdoc overview
 * @name finqApp.writer.controllers:StoryCtrl
 * @description
 * # Story editor controller
 *
 * The story editor controller allows the user to edit or create a new story.
 */
angular.module('finqApp.writer.controller')
    .controller('StoryCtrl', function ($scope, $selectedItem, $routeParams, $storyEdit, $sidebar, $step, $storyVariable, $module, MODULES, STATE, $location) {
        var that = this;
        this.selectedItem = {
            setSelectedItem: $selectedItem.setSelectedItem,
            isItemSelected: $selectedItem.isItemSelected
        };
        this.loaded = true;
        this.createNew = true;
        this.collections = {
            prologue: {
                id: 0,
                isAdding: false,
                inputValue: ''
            },
            scenarios: {
                id: 1,
                isAdding: false,
                inputValue: ''
            },
            epilogue: {
                id: 2,
                isAdding: false,
                inputValue: ''
            }
        };
        this.model = null;

        $module.setCurrentSection(MODULES.WRITER.sections.STORIES);

        this.toggleSidebar = function () {
            switch ($sidebar.getStatus()) {
                case STATE.SIDEBAR.COLLAPSED:
                    $sidebar.expand();
                    break;
                case STATE.SIDEBAR.EXPANDED:
                    $sidebar.collapse();
                    break;
                default:
                    break;
            }
        };

        this.sidebarIsExpanded = function () {
            return $sidebar.getStatus() === STATE.SIDEBAR.EXPANDED;
        };

        var foundStory = $storyEdit.getStory(parseInt($routeParams.storyId));
        if (foundStory === null) {
            // TODO alert the user to no story found
        } else {
            that.createNew = false;
            $storyVariable.setupVariables(foundStory);
            this.model = foundStory;
        }

        $sidebar.setDirective({
            'scenario-variables-view': null
        });

        this.add = function(collection) {
            collection.isAdding = true;
        };

        this.clear = function(collection) {
            collection.isAdding = false;
            collection.inputValue = '';
        };

        this.back = function () {
            $storyEdit.cancel(this.model.id);
            $location.url('/writer/stories');
        };

        this.save = function () {
            $storyEdit.apply(this.model.id);
        };


        // TODO remove this, used for poking ng-repeat/checking if scope matches visual representation
        this.insertObject = function () {
            insertObject(this.scenarios[0].steps, 0, {id: 21343241, title: 'sfasdfwe'});
        };

        function insertObject(array, object, insertPosition) {
            array.splice(insertPosition, 0, object);
        }

        var stepsBloodhound = new Bloodhound({
            datumTokenizer: function (d) {
                return Bloodhound.tokenizers.whitespace(d.template);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: []
        });
        stepsBloodhound.initialize();

        this.stepsDataset = {
            displayKey: 'template',
            source: stepsBloodhound.ttAdapter()
        };

        this.typeAheadOptions = {
            highlight: true
        };

        this.isString = angular.isString;


        $step.list().then(function (steps) {
            stepsBloodhound.add(steps);
        });


    }
);
