/**
 * Created by marc.fokkert on 4-3-2015.
 */
angular.module('finqApp.writer.service')
    .service('selectedItem', function () {
        var selectedItemId, selectedItem;

        ClearSelectedItem();

        this.setSelectedItem = SetSelectedItem;
        this.isItemSelected = IsItemSelected;
        this.getSelectedItem = GetSelectedItem;
        this.getSelectedItemId = GetSelectedItemId;
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
            selectedItemId = null;
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
            if (item === null){
                return null;
            }
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
            } else if (item.template !== undefined) {
                prefix = "step";
            } else {
                prefix = "section"
            }
            return prefix;
        }

        function GetSelectedItem(){
            return selectedItem;
        }

        function GetSelectedItemId(){
            return selectedItemId;
        }


    });
