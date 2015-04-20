'use strict';

/**
 * @ngdoc overview
 * @name finqApp.writer.controller:StoriesCtrl
 * @description
 * # Stories editor controller
 *
 * The stories editor controller allows the user to list all available stories to edit.
 */
angular.module('finqApp.writer.controller')
    .controller('StoriesCtrl', function($scope, module, MODULES, story, config, selectedItem){
        module.setCurrentSection(MODULES.WRITER.sections.STORIES);

        this.selectedItem = {
            setSelectedItem: selectedItem.setSelectedItem,
            isItemSelected: selectedItem.isItemSelected
        };

        $scope.storybooks = [];

        story.list().then(function(storyBooks){
            $scope.storybooks = storyBooks;
        });
        this.currentPage = 0;
        this.maxScenarios = config.client().available.pagination.client.scenariosPerPage;

        this.newStoryHref = newStory;

        function newStory(book){
            return '/writer/new/' + book;
        }



    });
