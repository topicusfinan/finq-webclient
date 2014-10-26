/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: SubscriptionService', function() {

    var subscriptionService,
        socketService,
        EVENTS;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, subscription, _EVENTS_, socket, config) {
        subscriptionService = subscription;
        socketService = socket;
        EVENTS = _EVENTS_;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            socket: {
                endpoint: '',
                mocked: true
            }
        });
        config.load();
        $httpBackend.flush();
    }));

    it('should support subscribing to a story run by calling the socketservice', function (done) {
        var emitSpy = sinon.spy(socketService,'emit');
        subscriptionService.subscribe(1);
        setTimeout(function() {
            emitSpy.should.have.been.calledWith(EVENTS.SOCKET.RUN.SUBSCRIBE,{run: 1});
            done();
        },15);
    });

    it('should support registration of socket event listeners', function (done) {
        var onSpy = sinon.spy(socketService,'on');
        subscriptionService.register(EVENTS.SOCKET.RUN.UPDATED,'test');
        socketService.connect();
        setTimeout(function() {
            onSpy.should.have.been.called.once;
            done();
        },15);
    });

    it('should support unregistering an existing event listener', function (done) {
        var reference = subscriptionService.register(EVENTS.SOCKET.RUN.UPDATED,'test');
        var offSpy = sinon.spy(socketService,'off');
        socketService.connect();
        setTimeout(function() {
            expect(subscriptionService.unRegister(EVENTS.SOCKET.RUN.UPDATED,reference)).to.be.true;
            expect(subscriptionService.unRegister(EVENTS.SOCKET.RUN.UPDATED,reference)).to.be.false;
            offSpy.should.have.been.called.once;
            done();
        },15);
    });

});
