'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:set
 * @description
 * # Test set service
 *
 * Makes it possible to execute CRUD and list operations on test sets.
 */
angular.module('finqApp')
    .service('set', ['backend', function (backend) {
        var that = this;
        var sets = null;
        this.load = function(callback) {
            backend.get('/set/list').success(function(sets) {
                callback(sets);
            });
        };
        this.list = function(callback,forceReload) {
            if (forceReload || sets === null) {
                that.load(callback);
            } else {
                callback(sets);
            }
        };
    }]);
