/**
 * Created by marc.fokkert on 12-3-2015.
 */
angular.module('finqApp.writer.service')
    .service('arrayOperations', function () {
        this.insertItem = insertItem;
        this.moveItem = moveItem;
        this.removeItem = removeItem;


        function insertItem(collection, position, item){
            collection.splice(position, 0, item);
        }

        function removeItem(collection, position){
            return collection.splice(position, 1)[0];
        }

        function moveItem(collection, startPosition, endPosition){
            insertItem(collection, endPosition, removeItem(collection, startPosition));
        }
    });
