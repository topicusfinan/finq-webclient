'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:translate
 * @description
 * # Application translation service
 *
 * Loads translation files from the backend and provides access to the translation set
 * accessible through the standard ui-translation functionality.
 */
angular.module('finqApp.translate')
    .service('translate', ['backend','$q','$translate','$timeout', function (backend,$q,$translate,$timeout) {
        var translations;
        this.load = function(lang) {
            var deferred = $q.defer();
            var translateNotice = $timeout(function () {
                deferred.notify('Loading translations is taking too long');
            },5000);
            backend.get('/lang/'+lang+'.json').success(function(data) {
                translations = data;
                $translate.use(lang);
                $translate.refresh();
                deferred.resolve(data);
            }).error(function(data,status) {
                deferred.reject('Failed to load translations');
                throw 'Error loading translations. Server responded with status '+status;
            }).finally(function() {
                translateNotice.cancel();
            });
            return deferred.promise;
        };
        this.getTranslations = function() {
            return $q.when(translations);
        };
    }]);
