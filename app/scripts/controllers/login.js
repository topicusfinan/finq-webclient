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
    .controller('LoginCtrl', [
        '$state',
        '$scope',
        '$translate',
        'config',
        'authenticate',
        function ($state,$scope,$translate,configProvider,authenticateService) {
        var that = this;
        this.email = 'admin@example.org';
        this.password = 'admin';
        this.submitted = false;
        this.hasError = false;
        this.title = configProvider.title();

        var submitting = false;

        $translate('GENERAL.EMAIL_PLACEHOLDER').then(function (translatedValue) {
            that.emailPlaceholder = translatedValue;
        });
        $translate('GENERAL.PASS_PLACEHOLDER').then(function (translatedValue) {
            that.passPlaceholder = translatedValue;
        });
        $translate('LOGIN.SUBMIT_TITLE').then(function (translatedValue) {
            that.submitTitle = translatedValue;
        });

        $scope.authenticate = function() {
            if (submitting) {
                return;
            }
            that.hasError = false;
            that.submitted = true;
            submitting = true;
            authenticateService.authenticate(that.email,that.password).then(loginSuccess,loginFailed);
        };

        var loginSuccess = function() {
            submitting = false;
            $state.go('authenticated');
        };

        var loginFailed = function(error) {
            submitting = false;
            that.hasError = true;
            $translate('LOGIN.ERRORS.'+error).then(function (translatedValue) {
                that.loginError = translatedValue;
            });
            $scope.login.email.$setValidity(false);
            $scope.login.password.$setValidity(false);
        };
    }]);
