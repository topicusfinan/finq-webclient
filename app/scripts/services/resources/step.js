'use strict';
/**
 * @ngdoc function
 * @name finqApp.service.story:story
 * @description
 * # Story service
 *
 * Makes it possible to execute CRUD and list operations on steps.
 */
angular.module('finqApp.service')
    .service('$step', function ($q,$backend) {
        var steps = null;

        var load = function() {
            var deferred = $q.defer();
            $backend.get('/steps').success(function(stepData) {
                steps = stepData;
                deferred.resolve(steps);
            }).error(function() {
                deferred.reject('Loading steps failed');
            });
            return deferred.promise;
        };

        this.list = function(forceReload) {
            if (forceReload || steps === null) {
                return load();
            } else {
                return $q.when(steps);
            }
        };
    });
