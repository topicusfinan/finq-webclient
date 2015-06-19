'use strict';
/**
 * @ngdoc overview
 * @name finqApp.writer.services:SelectedItem
 * @description
 * # Selected item service
 *
 * Stores and provides selected items
 */
angular.module('finqApp.writer.service')
    .service('selectedItem', function () {
        var selectedItemId, selectedItem;

        clearSelectedItem();

        this.setSelectedItem = setSelectedItem;
        this.isItemSelected = isItemSelected;
        this.getSelectedItem = getSelectedItem;
        this.getSelectedItemId = getSelectedItemId;
        this.clearSelectedItem = clearSelectedItem;

        /**
         * Set selectedItem to reference the new item with a prefix based on its type
         * @param newItem
         * @returns {void}
         */
        function setSelectedItem(newItem){
            selectedItemId = getPrefixedId(newItem);
            selectedItem = newItem;
        }

        function clearSelectedItem(){
            selectedItemId = null;
            selectedItem = undefined;
        }

        /**
         * Check the item against the currently selected item
         * @param {Object} item
         * @returns {boolean}
         */
        function isItemSelected(item){
            return getPrefixedId(item) === selectedItemId;
        }

        /**
         * @return {string}
         */
        function getPrefixedId(item){
            if (item === null){
                return null;
            }
            return getPrefix(item) + item.id;
        }

        /**
         * Get the prefix for the item
         * @param {Object} item
         * @returns {string}
         */
        function getPrefix(item){
            var prefix;
            if (item.stories !== undefined){
                prefix = 'book';
            } else if (item.scenarios !== undefined){
                prefix = 'story';
            } else if (item.steps !== undefined){
                prefix = 'scenario';
            } else if (item.template !== undefined) {
                prefix = 'step';
            } else {
                prefix = 'section';
            }
            return prefix;
        }

        function getSelectedItem(){
            return selectedItem;
        }

        function getSelectedItemId(){
            return selectedItemId;
        }


    });
