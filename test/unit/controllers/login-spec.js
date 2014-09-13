'use strict';

describe('Unit: LoginCtrl initialization and login', function() {

    var LoginCtrl,
        configProvider,
        scope,
        authenticateService,
        backend,
        authenticateMock;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, config, authenticate, authServiceMock) {
        scope = $rootScope.$new();
        configProvider = config;
        authenticateService = authenticate;
        backend = $httpBackend;
        authenticateMock = authServiceMock;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address : ''
        });
        $httpBackend.expectGET('/app/info').respond(200, {
            subject: 'Test'
        });
        configProvider.load().then(function() {
            LoginCtrl = $controller('LoginCtrl', {$scope: scope});
        });
        $httpBackend.flush();
    }));

    it('should initially set its variables properly', function () {
        expect(LoginCtrl.submitted).to.be.false;
        expect(LoginCtrl.hasError).to.be.false;
        expect(LoginCtrl.title).to.equal('Test');
    });

    it('should be able to handle a successful login attempt', function () {
        backend.expectPOST('/auth/login').respond(200, authenticateMock.user);
        backend.expectGET('views/layout.html').respond(404);
        LoginCtrl.authenticate();
        backend.flush();
    });

});
