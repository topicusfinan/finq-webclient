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
                reconnectionAttempts: 10,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 20000,
                reconnectAlertCnt: 3
            }
        });
        config.load();
        $httpBackend.flush();
    }));

    it('should support subscribing to a story run by calling the socketservice', function () {
        var emitSpy = sinon.spy(socketService,'emit');
        subscriptionService.subscribe(EVENTS.SOCKET.RUN_STATUS_UPDATED,null,{run: 1});
        emitSpy.should.have.been.calledWith(EVENTS.SOCKET.RUN_SUBSCRIBE,{run: 1});
    });

    it('should support registration of socket event listeners', function () {
        var onSpy = sinon.spy(socketService,'on');
        subscriptionService.register(EVENTS.SOCKET.RUN_STATUS_UPDATED,'test');
        onSpy.should.have.been.called.once;
    });

    it('should support unregistering an existing event listener', function () {
        var reference = subscriptionService.register(EVENTS.SOCKET.RUN_STATUS_UPDATED,'test');
        var offSpy = sinon.spy(socketService,'off');
        expect(subscriptionService.unRegister(EVENTS.SOCKET.RUN_STATUS_UPDATED,reference)).to.be.true;
        expect(subscriptionService.unRegister(EVENTS.SOCKET.RUN_STATUS_UPDATED,reference)).to.be.false;
        offSpy.should.have.been.called.once;
    });

});
