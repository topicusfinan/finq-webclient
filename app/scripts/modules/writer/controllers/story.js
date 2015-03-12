'use strict';

/**
 * @ngdoc overview
 * @name finqApp.writer.controller:StoryCtrl
 * @description
 * # Story editor controller
 *
 * The story editor controller allows the user to edit or create a new story.
 */
angular.module('finqApp.writer.controller')
    .controller('StoryCtrl',
    function ($scope, selectedItem, $routeParams, story, sidebar, step, storyVariable) {
        var that = this;
        this.selectedItem = {
            setSelectedItem: selectedItem.setSelectedItem,
            isItemSelected: selectedItem.isItemSelected
        };
        this.editStoryTitle = false;
        this.loaded = true;
        this.createNew = true;

        this.id = null;
        this.title = null;
        this.scenarios = [];
        this.prologue = [];
        this.epilogue = [];
        this.sets = [];
        this.tags = [];



        // TODO move logic to service
        this.inputPlaceholder = 'Scenario title';
        $scope.$watch(function(){
            return selectedItem.getSelectedItemId();
        }, function(value){
            if (value !== undefined && value !== null){
                if (value.indexOf('scenario') !== -1){
                    that.inputPlaceholder = 'Scenario title';
                } else if (value.indexOf('step') !== -1){
                    that.inputPlaceholder = 'Step title';
                }
            }
        });


        this.toggleVisible = sidebar.toggleVisible;

        var foundStory = story.findStoryById(parseInt($routeParams.storyId));
        if (foundStory === null) {
            // TODO alert the user to no story found
        } else {

            this.id = foundStory.id;
            this.title = foundStory.title;
            this.sets = foundStory.sets;
            this.tags = foundStory.tags;
            this.scenarios = foundStory.scenarios;
            this.epilogue = foundStory.epilogue;
            this.prologue = foundStory.prologue;
        }

        sidebar.setDirective({
            'scenario-variables-view': this.scenarios
        });



        // TODO remove this, used for poking ng-repeat/checking if scope matches visual representation
        this.insertObject = function(){
            InsertObject(this.scenarios[0].steps, 0, {id: 21343241, title: 'sfasdfwe'});
        };

        function InsertObject(array, insertObject, insertPosition){
            array.splice(insertPosition, 0, insertObject);
        }

        // TODO move this to a service
        this.inputValue = "";

        var stepsBloodhound = new Bloodhound({
            datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.template);},
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: []
        });
        stepsBloodhound.initialize();

        that.stepsDataset = {
            displayKey: 'template',
            source: stepsBloodhound.ttAdapter()
        };

        that.typeAheadOptions = {
            highlight: true
        };

        that.isString = angular.isString;


        step.list().then(function(steps){
            stepsBloodhound.add(steps);
        });



    }
);
