'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:tag
 * @description
 * # Tag service
 *
 * Makes it possible to execute CRUD and list operations on tags.
 */
angular.module('finqApp')
    .service('tag', ['backend', function (backend) {
        var that = this;
        var tags = null;
        this.load = function(callback) {
            backend.get('/tag/list').success(function(tags) {
                callback(tags);
            });
        };
        this.list = function(callback,forceReload) {
            if (forceReload || tags === null) {
                that.load(callback);
            } else {
                callback(tags);
            }
        };
    }]);
