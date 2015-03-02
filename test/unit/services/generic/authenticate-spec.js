/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: AuthenticateService initialization', function() {

    var authenticateService,
        backend,
        authenticateMock;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, authenticate, authServiceMock) {
        authenticateService = authenticate;
        backend = $httpBackend;
        authenticateMock = authServiceMock;
    }));

    it('should properly handle a failed authentication', function (done) {
        backend.expectGET('/users/current').respond(401, authenticateMock.error);
        authenticateService.load().then(null,function(errorCode) {
            expect(errorCode).to.equal(authenticateMock.error);
            done();
        });
        backend.flush();
    });

    it('should be able to authenticate automatically if the server responds with an OK', function (done) {
        backend.expectGET('/users/current').respond(200, authenticateMock.user);
        authenticateService.load().then(function(userData) {
            expect(userData.name).to.equal(authenticateMock.user.name);
            done();
        });
        backend.flush();
    });

    it('should be able to handle a failed login attempt', function (done) {
        backend.expectPOST('/users/login').respond(401, authenticateMock.error);
        authenticateService.authenticate('test','test').then(null,function(errorCode) {
            expect(errorCode).to.equal(authenticateMock.error);
            done();
        });
        backend.flush();
    });

    it('should be able to handle a successful login attempt', function (done) {
        backend.expectPOST('/users/login').respond(200, 'fake-authentication-token');
        backend.expectGET('/users/current').respond(200, authenticateMock.user);
        authenticateService.authenticate('test','test').then(function(userData) {
            expect(userData.name).to.equal(authenticateMock.user.name);
            done();
        });
        backend.flush();
    });

    it('should be able to return the current user', function (done) {
        backend.expectPOST('/users/login').respond(200, 'fake-authentication-token');
        backend.expectGET('/users/current').respond(200, authenticateMock.user);
        authenticateService.authenticate('test','test').then(function() {
            expect(authenticateService.getCurrentUser().name).to.equal(authenticateMock.user.name);
            done();
        });
        backend.flush();
    });

});
