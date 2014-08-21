/**
 * Created by c.kramer on 8/15/2014.
 */
'use strict';

/**
 * @ngdoc function
 * @name finqApp.service.config
 * @description
 * # Application configuration provider
 *
 * Provides application wide configuration values.
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
