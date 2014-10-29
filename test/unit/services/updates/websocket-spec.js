/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: Websocket', function() {

    var EVENTS,
        websocketService;

    beforeEach(function() {
        module('finqApp');
    });
    beforeEach(inject(function (_EVENTS_, websocket) {
        EVENTS = _EVENTS_;
        websocketService = websocket;
    }));

    it('should be able to register to an event and trigger its handler several times', function (done) {
        websocketService.connect('',{
            mocked: true
        });
        var counter = 1;
        var testFn = function(event, data) {
            expect(event).to.equal('test');
            expect(data).to.equal('data'+counter++);
            if (counter === 3) {
                done();
            }
        };
        websocketService.on('test',testFn);
        websocketService.emit('test','data1');
        websocketService.emit('test','data2');
    });

    it('should be able to register to an event and trigger its handler only once', function (done) {
        websocketService.connect('',{
            mocked: true
        });
        var counter = 1;
        var testFn = function(event, data) {
            expect(event).to.equal('test');
            expect(data).to.equal('data'+counter++);
            if (counter === 3) {
                done();
            }
        };
        websocketService.once('test',testFn);
        websocketService.emit('test','data1');
        websocketService.emit('test','data1');
        websocketService.once('test',testFn);
        websocketService.emit('test','data2');
    });

    it('should be able to unregister an event handler', function (done) {
        websocketService.connect('',{
            mocked: true
        });
        var counter = 1;
        var testFn = function(event, data) {
            expect(event).to.equal('test');
            expect(data).to.equal('data'+counter++);
            if (counter === 2) {
                done();
            }
        };
        websocketService.on('test',testFn);
        websocketService.off('test',testFn);
        websocketService.emit('test','data0');
        websocketService.once('test',testFn);
        websocketService.emit('test','data1');
    });

    it('should be able to reconnect automatically on a connection loss', function (done) {
        var socket = websocketService.connect('',{
            mocked: true,
            reconnectAttempts: 1,
            timeout: 20
        });
        var reconnectListener = function() {
            done();
        };
        websocketService.on(EVENTS.SOCKET.MAIN.RECONNECTING,reconnectListener);
        setTimeout(function() {
            socket.onclose();
        },8);
    });

    it('should publish a reconnection event after successfully re-establishing a connection', function (done) {
        var socket = websocketService.connect('',{
            mocked: true,
            reconnectAttempts: 1
        });
        var reconnectListener = function() {
            done();
        };
        websocketService.on(EVENTS.SOCKET.MAIN.RECONNECTED,reconnectListener);
        setTimeout(function() {
            socket.onclose();
        },8);
    });

    it('should not attempt to reconnect in case of a forcefully closed connection', function (done) {
        websocketService.connect('',{
            mocked: true,
            reconnectAttempts: 1
        });
        var reconnecting = false;
        var reconnectListener = function() {
            reconnecting = true;
        };
        websocketService.on(EVENTS.SOCKET.MAIN.RECONNECTED,reconnectListener);
        setTimeout(function() {
            websocketService.disconnect();
            setTimeout(function() {
                expect(reconnecting).to.be.false;
                done();
            },8);
        },8);
    });

    it('should dispatch a disconnection event in case of a lost connection', function (done) {
        var socket = websocketService.connect('',{
            mocked: true
        });
        var disconnectionListener = function() {
            done();
        };
        websocketService.on(EVENTS.SOCKET.MAIN.DISCONNECTED,disconnectionListener);
        setTimeout(function() {
            socket.onclose();
        },8);
    });

    it('should not attempt to reconnect of there are no reconnection tries left', function (done) {
        var socket = websocketService.connect('',{
            mocked: true
        });
        var reconnecting = false;
        var reconnectListener = function() {
            reconnecting = true;
        };
        websocketService.on(EVENTS.SOCKET.MAIN.RECONNECTED,reconnectListener);
        setTimeout(function() {
            socket.onclose();
            setTimeout(function() {
                expect(reconnecting).to.be.false;
                done();
            },8);
        },8);
    });

    it('should transform a received message into an event with event data', function (done) {
        var socket = websocketService.connect('',{
            mocked: true
        });
        var testListener = function(event, data) {
            expect(event).to.equal('test');
            expect(data).to.equal('data');
            done();
        };
        websocketService.on('test',testListener);
        setTimeout(function() {
            socket.onmessage('{"event": "test", "data": "data"}');
        },8);
    });

    it('should dispatch an error event when a socket error occurs', function (done) {
        var socket = websocketService.connect('',{
            mocked: true
        });
        var errorListener = function(event, data) {
            expect(data).to.equal('error');
            done();
        };
        websocketService.on(EVENTS.SOCKET.MAIN.ERROR,errorListener);
        setTimeout(function() {
            socket.onerror('error');
        },8);
    });

});
