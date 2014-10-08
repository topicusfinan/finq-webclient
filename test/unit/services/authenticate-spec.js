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
        backend.expectGET('/auth/user').respond(401, authenticateMock.error);
        authenticateService.load().then(null,function(errorCode) {
            expect(errorCode).to.equal(authenticateMock.error);
            done();
        });
        backend.flush();
    });

    it('should be able to authenticate automatically if the server responds with an OK', function (done) {
        backend.expectGET('/auth/user').respond(200, authenticateMock.user);
        authenticateService.load().then(function(userData) {
            expect(userData).to.deep.equal(authenticateMock.user);
            done();
        });
        backend.flush();
    });

    it('should be able to handle a failed login attempt', function (done) {
        backend.expectPOST('/auth/login').respond(401, authenticateMock.error);
        authenticateService.authenticate('test','test').then(null,function(errorCode) {
            expect(errorCode).to.equal(authenticateMock.error);
            done();
        });
        backend.flush();
    });

    it('should be able to handle a successful login attempt', function (done) {
        backend.expectPOST('/auth/login').respond(200, authenticateMock.user);
        authenticateService.authenticate('test','test').then(function(userData) {
            expect(userData).to.deep.equal(authenticateMock.user);
            done();
        });
        backend.flush();
    });

    it('should be able to return the current user', function (done) {
        backend.expectPOST('/auth/login').respond(200, authenticateMock.user);
        authenticateService.authenticate('test','test').then(function() {
            expect(authenticateService.getCurrentUser()).to.deep.equal(authenticateMock.user);
            done();
        });
        backend.flush();
    });

});
