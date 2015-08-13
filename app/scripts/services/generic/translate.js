'use strict';

/**
 * @ngdoc function
 * @name finqApp.service:translation
 * @description
 * # Application translation service
 *
 * Loads translation files from the backend and provides access to the translation set
 * accessible through the standard ui-translation functionality.
 */
angular.module('finqApp.service')
    .service('$translation', function ($backend, $q, $translate) {
        var translations;
        this.load = function (lang) {
            var deferred = $q.defer();
            var notice = setTimeout(function () {
                deferred.notify('Loading translations is taking too long');
            }, 5000);
            $backend.get('/lang/' + lang + '.json').success(function (data) {
                translations = data;
                $translate.use(lang);
                $translate.refresh();
                deferred.resolve(data);
            }).error(function () {
                deferred.reject('Failed to load translations');
            }).finally(function () {
                clearTimeout(notice);
            });
            return deferred.promise;
        };
        this.getTranslations = function () {
            return $q.when(translations);
        };
    });
