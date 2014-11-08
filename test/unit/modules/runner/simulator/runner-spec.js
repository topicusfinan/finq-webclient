/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: StoryRunnerMockSimulator scenario always succeeds on the first try', function() {

    var socketService,
        $timeout,
        EVENTS,
        STATE,
        storyMockData,
        simulator;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function (_$timeout_, $httpBackend, socket, runnerMockSimulator, config, _EVENTS_, story, storyServiceMock, _STATE_) {
        socketService = socket;
        EVENTS = _EVENTS_;
        STATE = _STATE_;
        $timeout = _$timeout_;
        storyMockData = storyServiceMock.books;
        simulator = runnerMockSimulator;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            mock: {
                runSimulation: {
                    interval: 10,
                    runSelectChance: 1,
                    storySelectChance: 1,
                    scenarioSelectChance: 1,
                    stepSuccessChance: 1,
                    stepFailChance: 0
                }
            },
            socket: {
                endpoint: '',
                mocked: true
            }
        });
        $httpBackend.expectGET('/books').respond(200, storyMockData);
        config.load();
        story.list();
        $httpBackend.flush();
        socket.connect();
    }));

    it('should publish an update with all steps as successful', function (done) {
        var runUpdateSpy = sinon.spy(socketService, 'emit');
        simulator.registerRun({
            id: 1,
            stories: [
                {
                    id: 46421532,
                    scenarios: [23452343,23452345]
                }
            ]
        });

        setTimeout(function() {
            $timeout.flush();
            runUpdateSpy.should.have.been.calledWith(EVENTS.SOCKET.RUN.UPDATED, {
                id: 1,
                status: STATE.RUN.SCENARIO.RUNNING,
                story: {
                    id: 46421532,
                    status: STATE.RUN.SCENARIO.RUNNING,
                    scenario: {
                        id: 23452343,
                        status: STATE.RUN.SCENARIO.RUNNING,
                        steps: [{status: STATE.RUN.SCENARIO.SUCCESS},{status: STATE.RUN.SCENARIO.RUNNING},{status: STATE.RUN.SCENARIO.QUEUED}]
                    }
                }
            });
            done();
        },14);

        setTimeout(function() {
            $timeout.flush();
            runUpdateSpy.should.have.been.calledWith(EVENTS.SOCKET.RUN.UPDATED, {
                id: 1,
                status: STATE.RUN.SCENARIO.RUNNING,
                story: {
                    id: 46421532,
                    status: STATE.RUN.SCENARIO.RUNNING,
                    scenario: {
                        id: 23452343,
                        status: STATE.RUN.SCENARIO.RUNNING,
                        steps: [{status: STATE.RUN.SCENARIO.SUCCESS},{status: STATE.RUN.SCENARIO.SUCCESS},{status: STATE.RUN.SCENARIO.RUNNING}]
                    }
                }
            });
            done();
        },28);

        setTimeout(function() {
            $timeout.flush();
            runUpdateSpy.should.have.been.calledWith(EVENTS.SOCKET.RUN.UPDATED, {
                id: 1,
                status: STATE.RUN.SCENARIO.RUNNING,
                story: {
                    id: 46421532,
                    status: STATE.RUN.SCENARIO.RUNNING,
                    scenario: {
                        id: 23452343,
                        status: STATE.RUN.SCENARIO.SUCCESS,
                        steps: [{status: STATE.RUN.SCENARIO.SUCCESS},{status: STATE.RUN.SCENARIO.SUCCESS},{status: STATE.RUN.SCENARIO.SUCCESS}]
                    }
                }
            });
            done();
        },42);

    });

});


describe('Unit: StoryRunnerMockSimulator steps always fails on the first try', function() {

    var socketService,
        $timeout,
        EVENTS,
        STATE,
        storyMockData,
        simulator;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function (_$timeout_, $httpBackend, socket, runnerMockSimulator, config, _EVENTS_, story, storyServiceMock, _STATE_) {
        socketService = socket;
        EVENTS = _EVENTS_;
        STATE = _STATE_;
        $timeout = _$timeout_;
        storyMockData = storyServiceMock.books;
        simulator = runnerMockSimulator;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            mock: {
                runSimulation: {
                    interval: 10,
                    runSelectChance: 1,
                    storySelectChance: 1,
                    scenarioSelectChance: 1,
                    stepSuccessChance: 0,
                    stepFailChance: 1
                }
            },
            socket: {
                endpoint: '',
                mocked: true
            }
        });
        $httpBackend.expectGET('/books').respond(200, storyMockData);
        config.load();
        story.list();
        $httpBackend.flush();
        socket.connect();
    }));

    it('should publish an update with all scenarios as failed', function (done) {
        var runUpdateSpy = sinon.spy(socketService, 'emit');
        simulator.registerRun({
            id: 1,
            stories: [
                {
                    id: 46421532,
                    scenarios: [23452343,23452345]
                }
            ]
        });

        setTimeout(function() {
            $timeout.flush();
            runUpdateSpy.should.have.been.calledWith(EVENTS.SOCKET.RUN.UPDATED, {
                id: 1,
                status: STATE.RUN.SCENARIO.FAILED,
                story: {
                    id: 46421532,
                    status: STATE.RUN.SCENARIO.FAILED,
                    scenario: {
                        id: 23452343,
                        status: STATE.RUN.SCENARIO.FAILED,
                        steps: [
                            {status: STATE.RUN.SCENARIO.FAILED, message: 'Fate determined that it was to be so'},
                            {status: STATE.RUN.SCENARIO.QUEUED},
                            {status: STATE.RUN.SCENARIO.QUEUED}]
                    }
                }
            });
            done();
        },14);

        setTimeout(function() {
            try {
                $timeout.flush();
            } catch (error) {
                runUpdateSpy.should.have.been.called.once;
                done();
            }
        },28);

    });

});

describe('Unit: StoryRunnerMockSimulator run should continue to run in case it was not finished', function() {

    var socketService,
        $timeout,
        EVENTS,
        STATE,
        storyMockData,
        simulator;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function (_$timeout_, $httpBackend, socket, runnerMockSimulator, config, _EVENTS_, story, storyServiceMock, _STATE_) {
        socketService = socket;
        EVENTS = _EVENTS_;
        STATE = _STATE_;
        $timeout = _$timeout_;
        storyMockData = storyServiceMock.books;
        simulator = runnerMockSimulator;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            mock: {
                runSimulation: {
                    interval: 10,
                    runSelectChance: 1,
                    storySelectChance: 1,
                    scenarioSelectChance: 1,
                    stepSuccessChance: 0,
                    stepFailChance: 0
                }
            },
            socket: {
                endpoint: '',
                mocked: true
            }
        });
        $httpBackend.expectGET('/books').respond(200, storyMockData);
        config.load();
        story.list();
        $httpBackend.flush();
        socket.connect();
    }));

    it('should not publish an event in case the run did not change', function (done) {
        var runUpdateSpy = sinon.spy(socketService, 'emit');
        simulator.registerRun({
            id: 1,
            stories: [
                {
                    id: 46421532,
                    scenarios: [23452343,23452345]
                }
            ]
        });

        setTimeout(function() {
            $timeout.flush();
            runUpdateSpy.should.not.have.been.called;
            done();
        },14);

    });

});
