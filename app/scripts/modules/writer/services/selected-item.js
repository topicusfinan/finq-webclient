/**
 * Created by marc.fokkert on 4-3-2015.
 */
angular.module('finqApp.writer.service')
    .service('selectedItem', function () {
        var selectedItemId, selectedItem;

        this.setSelectedItem = SetSelectedItem;
        this.isItemSelected = IsItemSelected;
        this.getSelectedItem = GetSelectedItem;
        this.clearSelectedItem = ClearSelectedItem;

        /**
         * Set selectedItem to reference the new item with a prefix based on its type
         * @param newItem
         * @returns {void}
         */
        function SetSelectedItem(newItem){
            selectedItemId = GetPrefixedId(newItem);
            selectedItem = newItem;
        }

        function ClearSelectedItem(){
            selectedItemId = undefined;
            selectedItem = undefined;
        }

        /**
         * Check the item against the currently selected item
         * @param {Object} item
         * @returns {boolean}
         */
        function IsItemSelected(item){
            return GetPrefixedId(item) === selectedItemId;
        }

        /**
         * @return {string}
         */
        function GetPrefixedId(item){
            return GetPrefix(item) + item.id;
        }

        /**
         * Get the prefix for the item
         * @param {Object} item
         * @returns {string}
         */
        function GetPrefix(item){
            var prefix;
            if (item.stories !== undefined){
                prefix = "book";
            } else if (item.scenarios !== undefined){
                prefix = "story";
            } else if (item.steps !== undefined){
                prefix = "scenario";
            } else {
                prefix = "step";
            }
            return prefix;
        }

        function GetSelectedItem(){
            return selectedItem;
        }


    });
