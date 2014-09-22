'use strict';

describe('Unit: HeaderCtrl initialization', function() {

    var HeaderCtrl,
        configProvider,
        EVENTS,
        scope;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, config, _EVENTS_) {
        scope = $rootScope.$new();
        configProvider = config;
        EVENTS = _EVENTS_;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            searchWait: 10,
            address: ''
        });
        $httpBackend.expectGET('/app/info').respond(200, {
            subject: 'Test'
        });
        configProvider.load().then(function() {
            HeaderCtrl = $controller('HeaderCtrl', {$scope: scope});
        });
        $httpBackend.flush();
    }));

    it('should initialize set its variables properly', function () {
        expect(HeaderCtrl.query).to.equal('');
        expect(HeaderCtrl.timeout).to.equal(10);
        expect(HeaderCtrl.loaded).not.to.be.true;
        expect(HeaderCtrl.title).to.equal('Test');
    });

    it('should respond to a search request by setting a search timeout and cancelling it if another request is made before the timeout', function (done) {
        var emitSpy = sinon.spy(scope, '$emit');
        HeaderCtrl.query = 'test';
        HeaderCtrl.search();
        HeaderCtrl.query = 'test2';
        HeaderCtrl.search();
        setTimeout(function() {
            expect(emitSpy).to.have.been.calledWith(EVENTS.SEARCH_UPDATED,'test2');
            emitSpy.should.have.been.called.once;
            done();
        },15);

    });

});
