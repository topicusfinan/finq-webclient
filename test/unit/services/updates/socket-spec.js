/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: SocketService', function() {

    var socketService,
        FEEDBACK,
        EVENTS,
        $rootScope,
        feedbackService;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function (_$rootScope_, $httpBackend, socket, config, feedback, _FEEDBACK_, _EVENTS_) {
        socketService = socket;
        feedbackService = feedback;
        FEEDBACK = _FEEDBACK_;
        EVENTS = _EVENTS_;
        $rootScope = _$rootScope_;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            socket: {
                endpoint: '',
                reconnectDelay: 0,
                reconnectAttempts: 3,
                reconnectDelayMax: 5000,
                timeout: 20000,
                reconnectAlertCnt: 3,
                mocked: true
            }
        });
        config.load();
        $httpBackend.flush();
    }));

    it('should initially not be connected', function () {
        expect(socketService.isConnected()).to.be.false;
    });

    it('should initialize a connection if requested to do so', function () {
        socketService.connect();
        expect(socketService.isConnected()).to.be.true;
    });

    it('should lose its connection if requested to disconnect after establishing a connection', function () {
        socketService.connect();
        socketService.emit('connect');
        socketService.emit('disconnect');
        expect(socketService.isConnected()).to.be.false;
    });

    it('should respond to a socket error by notifying the user with an error message', function () {
        var feedbackSpy = sinon.spy(feedbackService,'error');
        socketService.connect();
        socketService.emit(EVENTS.SOCKET.MAIN.ERROR);
        feedbackSpy.should.have.been.calledWith(FEEDBACK.ERROR.SOCKET.UNABLE_TO_CONNECT);
    });

    it('should respond with a reconnecting notice when trying a reconnection attempt for the first time', function () {
        var feedbackSpy = sinon.spy(feedbackService,'notice');
        socketService.connect();
        socketService.emit(EVENTS.SOCKET.MAIN.RECONNECTING,1);
        feedbackSpy.should.have.been.calledWith(FEEDBACK.NOTICE.SOCKET.RECONNECTING);
    });

    it('should respond with a reconnecting alert when trying a reconnection for a configured amount of times', function () {
        var feedbackSpy = sinon.spy(feedbackService,'alert');
        socketService.connect();
        socketService.emit(EVENTS.SOCKET.MAIN.RECONNECTING,3);
        feedbackSpy.should.have.been.calledWith(FEEDBACK.ALERT.SOCKET.RECONNECTION_TROUBLE);
    });

    it('should show a reconnected notice if reconnection succeeds', function () {
        var feedbackSpy = sinon.spy(feedbackService,'notice');
        socketService.connect();
        socketService.emit(EVENTS.SOCKET.MAIN.RECONNECTED);
        feedbackSpy.should.have.been.calledWith(FEEDBACK.NOTICE.SOCKET.RECONNECTED);
    });

    it('should show an error message if reconnecting to the socket has failed', function () {
        var feedbackSpy = sinon.spy(feedbackService,'error');
        socketService.connect();
        socketService.emit(EVENTS.SOCKET.MAIN.RECONNECT_FAILED);
        feedbackSpy.should.have.been.calledWith(FEEDBACK.ERROR.SOCKET.UNABLE_TO_RECONNECT);
    });

    it('should be able to add a listener to a custom event', function () {
        var testFn = {test: function() {}};
        var testSpy = sinon.spy(testFn,'test');
        socketService.connect();
        socketService.on('test',testFn.test);
        socketService.emit('test');
        testSpy.should.have.been.called.once;
    });

    it('should be able to remove a listener from a custom event', function () {
        var testFn = {test: function() {}};
        var testSpy = sinon.spy(testFn,'test');
        socketService.connect();
        socketService.on('test',testFn.test);
        socketService.off('test');
        socketService.emit('test');
        testSpy.should.not.have.been.called.once;
    });

    it('should be possible to add a listener to a custom event for only one event cycle', function () {
        var testFn = {test: function() {}};
        var testSpy = sinon.spy(testFn,'test');
        socketService.connect();
        socketService.once('test',testFn.test);
        socketService.emit('test');
        socketService.emit('test',{a:1});
        testSpy.should.not.have.been.calledWith('test',{a:1});
    });

    it('should throw an error in case a listener is registred without establishing a connection first', function (done) {
        try {
            socketService.on('test');
        } catch (error) {
            done();
        }
    });

    it('should throw an error in case a listener is registred once without establishing a connection first', function (done) {
        try {
            socketService.once('test');
        } catch (error) {
            done();
        }
    });

    it('should throw an error in case an emitter is triggered without establishing a connection first', function (done) {
        try {
            socketService.emit('test');
        } catch (error) {
            done();
        }
    });

});
