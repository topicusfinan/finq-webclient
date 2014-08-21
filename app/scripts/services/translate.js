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
    .service('translate', ['$http','$q','$translate', function ($http,$q,$translate) {
        var translations;
        this.load = function(lang,callback) {
            $http.get('/lang/'+lang+'.json').success(function(data) {
                translations = data;
                $translate.use(lang);
                $translate.refresh();
                callback(data);
            });
        };
        this.getTranslations = function() {
            return $q.when(translations);
        };
    }]);
