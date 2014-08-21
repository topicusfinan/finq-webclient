'use strict';

/**
 * @ngdoc overview
 * @name finqApp:LoginCtrl
 * @description
 * # Application login
 *
 * Present the user with a login screen that allows them to gain access to the Finq app.
 */
angular.module('finqApp')
    .controller('LoginCtrl', ['$state','$scope','$translate','config',function ($state,$scope,$translate,config) {
        var that = this;
        this.title = config.title();

        $translate('GENERAL.EMAIL_PLACEHOLDER').then(function (translatedValue) {
            that.emailPlaceholder = translatedValue;
        });
        $translate('GENERAL.PASS_PLACEHOLDER').then(function (translatedValue) {
            that.passPlaceholder = translatedValue;
        });
        $translate('LOGIN.SUBMIT_TITLE').then(function (translatedValue) {
            that.submitTitle = translatedValue;
        });

        if (1 === 0) {
            $state.go('authenticated');
        }
    }]);
