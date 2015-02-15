/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: PreloaderCtrl', function() {

    var state,
        scope,
        emitSpy,
        httpBackend,
        controller,
        appService,
        langData,
        environments,
        configProvider,
        stateSpy;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $state, appServiceMock, config) {
        scope = $rootScope.$new();
        state = $state;
        httpBackend = $httpBackend;
        controller = $controller;
        appService = appServiceMock;
        configProvider = config;
        emitSpy = sinon.spy(scope, '$emit');
        stateSpy = sinon.spy(state, 'go');
        langData = {
            LANG : 'US English',
            LOADER: {
                LOADED : 'All done!'
            }
        };
        environments = [{address: ''}];
    }));

    it('should fail to load in case of missing app configuration and translations', function () {
        httpBackend.expectGET('/lang/en.json').respond(503);
        httpBackend.expectGET('/scripts/config.json').respond(503);
        var PreloaderCtrl = controller('PreloaderCtrl', {$scope: scope});
        httpBackend.flush();
        expect(PreloaderCtrl.loadError.length).to.be.above(0);
        expect(PreloaderCtrl.loaded).to.be.false;
        scope.$emit('test');
        emitSpy.should.have.been.called.once;
    });

    it('should fail to load in case of missing app configuration', function () {
        httpBackend.expectGET('/lang/en.json').respond(200, langData);
        httpBackend.expectGET('/scripts/config.json').respond(503);
        var PreloaderCtrl = controller('PreloaderCtrl', {$scope: scope});
        httpBackend.flush();
        expect(PreloaderCtrl.loadError.length).to.be.above(0);
        expect(PreloaderCtrl.loaded).to.be.false;
        scope.$emit('test');
        emitSpy.should.have.been.called.once;
    });

    it('should fail to load in case of missing server configuration', function () {
        httpBackend.expectGET('/lang/en.json').respond(200, langData);
        httpBackend.expectGET('/scripts/config.json').respond(200, {address : '', authAddress: '', socket: {mocked: true}});
        httpBackend.expectGET('/app').respond(503);
        var PreloaderCtrl = controller('PreloaderCtrl', {$scope: scope});
        httpBackend.flush();
        expect(PreloaderCtrl.loadError.length).to.be.above(0);
        expect(PreloaderCtrl.loaded).to.be.false;
        scope.$emit('test');
        emitSpy.should.have.been.called.once;
    });

    it('should fail to load in case a missing environment list', function () {
        httpBackend.expectGET('/lang/en.json').respond(200, langData);
        httpBackend.expectGET('/scripts/config.json').respond(200, {address : '', authAddress: '', socket: {mocked: true}});
        httpBackend.expectGET('/app').respond(200, appService);
        httpBackend.expectGET('/environments').respond(503);
        var PreloaderCtrl = controller('PreloaderCtrl', {$scope: scope});
        httpBackend.flush();
        expect(PreloaderCtrl.loadError.length).to.be.above(0);
        expect(PreloaderCtrl.loaded).to.be.false;
        scope.$emit('test');
        emitSpy.should.have.been.called.once;
    });

    it('should succeed in loading if all data is retrieved properly but go to login if authorization fails', function () {
        httpBackend.expectGET('/lang/en.json').respond(200, langData);
        httpBackend.expectGET('/scripts/config.json').respond(200, {address : '', authAddress: '', socket: {mocked: true}});
        appService.authenticate = true;
        httpBackend.expectGET('/app').respond(200, appService);
        httpBackend.expectGET('/environments').respond(200, environments);
        httpBackend.expectGET('/users/current').respond(401);
        httpBackend.expectGET('views/intro/intro.html').respond(404);
        httpBackend.expectGET('views/intro/login.html').respond(404);
        var PreloaderCtrl = controller('PreloaderCtrl', {$scope: scope});
        httpBackend.flush();
        expect(PreloaderCtrl.loaded).to.be.true;
        expect(PreloaderCtrl.authorized).to.be.false;
        stateSpy.should.have.been.calledWith('intro.login');
    });

    it('should succeed in loading if all data is retrieved properly and skip login if authorization succeeds', function () {
        httpBackend.expectGET('/lang/en.json').respond(200, langData);
        httpBackend.expectGET('/scripts/config.json').respond(200, {address : '', authAddress: '', socket: {mocked: true}});
        appService.authenticate = true;
        httpBackend.expectGET('/app').respond(200, appService);
        httpBackend.expectGET('/environments').respond(200, environments);
        httpBackend.expectGET('/users/current').respond(200, {name: 'test', email: 'test'});
        httpBackend.expectGET('views/layout.html').respond(404);
        var PreloaderCtrl = controller('PreloaderCtrl', {$scope: scope});
        httpBackend.flush();
        expect(PreloaderCtrl.loaded).to.be.true;
        expect(PreloaderCtrl.authorized).to.be.true;
        expect(PreloaderCtrl.progress).to.equal('100%');
        stateSpy.should.have.been.calledWith('authorized');
    });

    it('should support skipping of authentication', function () {
        httpBackend.expectGET('/lang/en.json').respond(200, langData);
        httpBackend.expectGET('/scripts/config.json').respond(200, {address : '', authAddress: '', socket: {mocked: true}});
        appService.authenticate = false;
        httpBackend.expectGET('/app').respond(200, appService);
        httpBackend.expectGET('/environments').respond(200, environments);
        httpBackend.expectGET('views/layout.html').respond(404);
        var PreloaderCtrl = controller('PreloaderCtrl', {$scope: scope});
        httpBackend.flush();
        expect(PreloaderCtrl.loaded).to.be.true;
        expect(PreloaderCtrl.authorized).to.be.true;
        stateSpy.should.have.been.calledWith('authorized');
    });

});
