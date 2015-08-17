'use strict';
/**
 * @ngdoc overview
 * @name finqApp.writer.controllers:StoriesCtrl
 * @description
 * # Stories editor controller
 *
 * The stories editor controller allows the user to list all available stories to edit.
 */
angular.module('finqApp.writer.controller')
    .controller('StoriesCtrl', function ($location, $scope, $module, MODULES, FEEDBACK, $story, $config, $selectedItem, $feedback) {

        this.selectedItem = $selectedItem;
        this.currentPage = 0;
        this.maxScenarios = $config.client().available.pagination.client.scenariosPerPage;

        $scope.storybooks = [];

        $story.list().then(function (storyBooks) {
            $scope.storybooks = storyBooks;
        });

        $module.setCurrentSection(MODULES.WRITER.sections.STORIES);

        this.add = function (bookId) {
            if (bookId !== void 0 && $story.findBookById(bookId) === null) {
                $feedback.error(FEEDBACK.ERROR.RESOURCE.BOOK.UNABLE_TO_LOAD);
                return;
            } else bookId = '';
            $location.path('/' + MODULES.WRITER.sections.STORIES.actions.NEW.id.toLowerCase().replace('.', '/') + '/' + bookId);
        };

        this.edit = function (storyId) {
            if (storyId !== void 0) {
                if ($story.findStoryById(storyId) === null) {
                    $feedback.error(FEEDBACK.ERROR.RESOURCE.STORY.UNABLE_TO_LOAD);
                    return;
                }
                $location.path('/' + MODULES.WRITER.sections.STORIES.id.toLowerCase().replace('.', '/') + '/' + storyId);
            } else {
                $feedback.error(FEEDBACK.ERROR.RESOURCE.STORY.UNABLE_TO_LOAD);
            }
        };

    });
