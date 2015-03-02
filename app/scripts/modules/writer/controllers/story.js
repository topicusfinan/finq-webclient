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
        function($scope){
            this.selectedItem = null;
            this.editStoryTitle = false;
            this.title = "blaat";
            this.loaded = true;
            this.createNew = true;
        }
    );
