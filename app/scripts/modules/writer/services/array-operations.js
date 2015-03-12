/**
 * Created by marc.fokkert on 12-3-2015.
 */
angular.module('finqApp.writer.service')
    .service('arrayOperations', function () {
        this.insert = Insert;
        this.move = Move;
        this.remove = Remove;


        function Insert(collection, position, item){
            collection.splice(position, 0, item);
        }

        function Remove(collection, position){
            return collection.splice(position, 1)[0];
        }

        function Move(collection, startPosition, endPosition){
            Insert(collection, endPosition, Remove(collection, startPosition));
        }


    });
