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
    .service('$selectedItem', function () {
        var selectedItemId, selectedItem, groupPrefix;

        clearSelectedItem();

        this.setSelectedItem = setSelectedItem;
        this.isItemSelected = isItemSelected;
        this.isNoItemSelected = isNoItemSelected;
        this.getSelectedItem = getSelectedItem;
        this.getSelectedItemId = getSelectedItemId;
        this.clearSelectedItem = clearSelectedItem;
        this.setGroupPrefix = setGroupPrefix;

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
            selectedItem = null;
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
         * Check if no item is selected
         * @returns {boolean}
         */
        function isNoItemSelected() {
            return selectedItemId === null;
        }

        /**
         * @return {string}
         */
        function getPrefixedId(item){
            if (item === null){
                return null;
            }
            return groupPrefix+getPrefix(item);
        }

        /**
         * Get the prefix for the item
         * @param {Object|Object[]} item
         * @returns {string}
         */
        function getPrefix(item){
            var itemPrefix = '';
            if (Array.isArray(item)) {
                for (var i=item.length-1; i>=0; i--) {
                    itemPrefix += getPrefix(item[i]);
                }
            } else {
                if (typeof item !== 'object') {
                    itemPrefix = '-item-'+item;
                } else {
                    if (item.stories !== undefined){
                        if (item.environment !== undefined) {
                            itemPrefix = '-run-'+item.id;
                        } else {
                            itemPrefix = '-book-'+item.id;
                        }
                    } else if (item.scenarios !== undefined){
                        itemPrefix = '-story-'+item.id;
                    } else if (item.steps !== undefined){
                        itemPrefix = '-scenario-'+item.id;
                    } else if (item.template !== undefined) {
                        itemPrefix = '-step-'+item.id;
                    } else {
                        itemPrefix = '-section-'+item.id;
                    }
                }
            }
            return itemPrefix;
        }

        function getSelectedItem(){
            return selectedItem;
        }

        function getSelectedItemId(){
            return selectedItemId;
        }

        function setGroupPrefix(targetPrefix) {
            groupPrefix = targetPrefix;
        }


    });
