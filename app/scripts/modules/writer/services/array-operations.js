/**
 * Created by marc.fokkert on 12-3-2015.
 */
angular.module('finqApp.writer.service')
    .service('arrayOperations', function () {
        this.insertItem = InsertItem;
        this.moveItem = MoveItem;
        this.removeItem = RemoveItem;


        function InsertItem(collection, position, item){
            collection.splice(position, 0, item);
        }

        function RemoveItem(collection, position){
            return collection.splice(position, 1)[0];
        }

        function MoveItem(collection, startPosition, endPosition){
            InsertItem(collection, endPosition, RemoveItem(collection, startPosition));
        }
    });
