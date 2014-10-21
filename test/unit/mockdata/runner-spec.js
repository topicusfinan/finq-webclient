/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: StoryRunnerMockSimulator scenario always succeeds on the first try', function() {

    var socketService,
        $timeout,
        EVENTS,
        simulator;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function (_$timeout_, $httpBackend, socket, runnerMockSimulator, config, _EVENTS_) {
        socketService = socket;
        EVENTS = _EVENTS_;
        $timeout = _$timeout_;
        simulator = runnerMockSimulator;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            mock: {
                runSimulation: {
                    interval: 10,
                    runSelectChance: 1,
                    storySelectChance: 1,
                    scenarioSelectChance: 1,
                    scenarioSuccessChance: 1,
                    scenarioFailChance: 0
                }
            },
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
        socket.connect();
    }));

    it('should publish an update with all scenarios as successful in case they have a 100% success chance', function (done) {
        var runUpdateSpy = sinon.spy(socketService, 'emit');
        simulator.registerRun({
            id: 1,
            stories: [
                {
                    id: 2,
                    scenarios: [3,4]
                }
            ]
        });

        setTimeout(function() {
            $timeout.flush();
            runUpdateSpy.should.have.been.calledWith(EVENTS.SOCKET.RUN_STATUS_UPDATED, {
                id: 1,
                progress: {
                    stories: [{
                        id: 2,
                        scenarios: [{status: 1}, {status: 1}]
                    }]
                }
            });
            done();
        },14);
    });

});


describe('Unit: StoryRunnerMockSimulator scenario always fails on the first try', function() {

    var socketService,
        $timeout,
        EVENTS,
        simulator;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function (_$timeout_, $httpBackend, socket, runnerMockSimulator, config, _EVENTS_) {
        socketService = socket;
        EVENTS = _EVENTS_;
        $timeout = _$timeout_;
        simulator = runnerMockSimulator;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            mock: {
                runSimulation: {
                    interval: 10,
                    runSelectChance: 1,
                    storySelectChance: 1,
                    scenarioSelectChance: 1,
                    scenarioSuccessChance: 0,
                    scenarioFailChance: 1
                }
            },
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
        socket.connect();
    }));

    it('should publish an update with all scenarios as successful in case they have a 100% failure chance', function (done) {
        var runUpdateSpy = sinon.spy(socketService, 'emit');
        simulator.registerRun({
            id: 1,
            stories: [
                {
                    id: 2,
                    scenarios: [3,4]
                }
            ]
        });

        setTimeout(function() {
            $timeout.flush();
            runUpdateSpy.should.have.been.calledWith(EVENTS.SOCKET.RUN_STATUS_UPDATED, {
                id: 1,
                progress: {
                    stories: [{
                        id: 2,
                        scenarios: [{status: 2}, {status: 2}]
                    }]
                }
            });
            done();
        },14);
    });

});
