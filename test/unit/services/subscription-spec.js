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
    beforeEach(inject(function (subscription, _EVENTS_, socket) {
        subscriptionService = subscription;
        socketService = socket;
        EVENTS = _EVENTS_;
    }));

    it('should support subscribing to a story run by calling the socketservice', function () {
        var emitSpy = sinon.spy(socketService,'emit');
        subscriptionService.subscribe(EVENTS.SOCKET.RUN_STATUS_UPDATED,{run: 1});
        emitSpy.should.have.been.calledWith(EVENTS.SOCKET.RUN_SUBSCRIBE,{run: 1});
    });

    it('should support registration of socket event listeners', function () {
        var onSpy = sinon.spy(socketService,'on');
        subscriptionService.register(EVENTS.SOCKET.RUN_STATUS_UPDATED,'test');
        onSpy.should.have.been.called.once;
        expect(socketService.events[EVENTS.SOCKET.RUN_STATUS_UPDATED].length).to.equal(1);
    });

    it('should support unregistering an existing event listener', function () {
        var reference = subscriptionService.register(EVENTS.SOCKET.RUN_STATUS_UPDATED,'test');
        var offSpy = sinon.spy(socketService,'off');
        expect(subscriptionService.unRegister(EVENTS.SOCKET.RUN_STATUS_UPDATED,reference)).to.be.true;
        expect(subscriptionService.unRegister(EVENTS.SOCKET.RUN_STATUS_UPDATED,reference)).to.be.false;
        offSpy.should.have.been.called.once;
    });

});
