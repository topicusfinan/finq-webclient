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
    function ($scope, selectedItem) {
        this.selectedItem = {
            setSelectedItem: selectedItem.setSelectedItem,
            isItemSelected: selectedItem.isItemSelected
        };
        this.editStoryTitle = false;
        this.title = "blaat";
        this.loaded = true;
        this.createNew = true;
        this.showVariables = true;

        this.scenarios = [
            {
                id: 1,
                title: "foo",
                steps: [
                    {
                        id: 1,
                        title: 'when the customer with id $customerId orders a new book with id $bookId resulting in a basket with id $basketId',
                        template: 'when the customer with id $customerId orders a new book with id $bookId resulting in a basket with id $basketId'
                    }]

            }
        ];
    }
);
