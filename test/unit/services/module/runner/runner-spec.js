/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: RunnerService', function() {

    var runnerService,
        moduleService,
        storyMockData,
        subscriptionService,
        backend,
        EVENTS,
        STATE,
        MODULES;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($httpBackend, module, runner, _EVENTS_, _STATE_, _MODULES_, story, storyServiceMock, subscription, config) {
        runnerService = runner;
        moduleService = module;
        storyMockData = storyServiceMock.books;
        backend = $httpBackend;
        EVENTS = _EVENTS_;
        STATE = _STATE_;
        MODULES = _MODULES_;
        subscriptionService = subscription;
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
        $httpBackend.expectGET('/books').respond(200, storyMockData);
        config.load();
        story.list();
        $httpBackend.flush();
    }));

    var startStories = function(storyData) {
        runnerService.handle(EVENTS.INTERNAL.STORY_RUN_STARTED, {
            id: 1,
            status: STATE.RUN.SCENARIO.RUNNING,
            stories: storyData
        });
    };

    var generateStoryUpdate = function(storyId,runStatus,storyStatus,scenarioStatus) {
        runnerService.handle(EVENTS.SOCKET.RUN.UPDATED, {
            id: 1,
            status: runStatus,
            story: {
                id: storyId,
                status: storyStatus,
                scenario: scenarioStatus
            }
        });
    };

    it('should subscribe to updates for a run in case a run was started', function () {
        var subscribeSpy = sinon.spy(subscriptionService, 'subscribe');
        startStories([{
                id: 46421532,
                scenarios: [23452343,23452345]
            }]);
        subscribeSpy.should.have.been.called.once;
    });

    it('should handle a progress update for a run that is subscribed to', function () {
        startStories([{
                id: 46421532,
                scenarios: [23452343,23452345]
            }]);
        generateStoryUpdate(46421532,STATE.RUN.SCENARIO.RUNNING,STATE.RUN.SCENARIO.RUNNING, {
            id: 23452343,
            status: STATE.RUN.SCENARIO.SUCCESS,
            steps: [{status: STATE.RUN.SCENARIO.SUCCESS}, {status: STATE.RUN.SCENARIO.SUCCESS}, {status: STATE.RUN.SCENARIO.SUCCESS}]
        });
        var runningStories = runnerService.getRunningSessions();
        expect(runningStories[0].progress.scenariosCompleted).to.equal(1);
        expect(runningStories[0].progress.stories[0].progress.scenariosCompleted).to.equal(1);
        expect(runningStories[0].progress.stories[0].scenarios[0].status).to.equal(STATE.RUN.SCENARIO.SUCCESS);
        expect(runningStories[0].progress.stories[0].scenarios[1].status).to.equal(STATE.RUN.SCENARIO.RUNNING);
        expect(runningStories[0].status).to.equal(STATE.RUN.SCENARIO.RUNNING);
    });

    it('should handle a progress update for a run that contains a failed scenario', function () {
        startStories([{
                id: 46421532,
                scenarios: [23452343,23452345]
            }]);
        generateStoryUpdate(46421532,STATE.RUN.SCENARIO.FAILED,STATE.RUN.SCENARIO.FAILED,{
            id: 23452343,
            status: STATE.RUN.SCENARIO.FAILED,
            steps: [{status: STATE.RUN.SCENARIO.SUCCESS},{status: STATE.RUN.SCENARIO.FAILED},{status: STATE.RUN.SCENARIO.QUEUED}]
        });
        generateStoryUpdate(46421532,STATE.RUN.SCENARIO.FAILED,STATE.RUN.SCENARIO.FAILED,{
            id: 23452345,
            status: STATE.RUN.SCENARIO.SUCCESS,
            steps: [{status: STATE.RUN.SCENARIO.SUCCESS},{status: STATE.RUN.SCENARIO.SUCCESS},{status: STATE.RUN.SCENARIO.SUCCESS},{status: STATE.RUN.SCENARIO.SUCCESS}]
        });
        var runningStories = runnerService.getRunningSessions();
        expect(runningStories[0].progress.scenariosCompleted).to.equal(2);
        expect(runningStories[0].progress.stories[0].progress.scenariosCompleted).to.equal(2);
        expect(runningStories[0].progress.stories[0].scenarios[0].status).to.equal(STATE.RUN.SCENARIO.FAILED);
        expect(runningStories[0].progress.stories[0].scenarios[1].status).to.equal(STATE.RUN.SCENARIO.SUCCESS);
        expect(runningStories[0].status).to.equal(STATE.RUN.SCENARIO.FAILED);
        expect(runningStories[0].progress.stories[0].status).to.equal(STATE.RUN.SCENARIO.FAILED);
    });

    it('should be able to handle an unforseen out of sync error on receiving an update for an unknown story', function (done) {
        startStories([{
                id: 46421532,
                scenarios: [23452343,23452345]
            }]);
        try {
            generateStoryUpdate(123,[]);
        } catch (error) {
            done();
        }
    });

    it('should be able to register a run of a subset of scenarios for a story', function () {
        startStories([{
                id: 46421532,
                scenarios: [23452343]
            }]);
        var runningStories = runnerService.getRunningSessions();
        expect(runningStories[0].progress.stories[0].scenarios.length).to.equal(1);
        expect(runningStories[0].progress.stories[0].scenarios[0].id).to.equal(23452343);
    });

    it('should use the title of the only story that is included in the run when there is only one', function () {
        startStories([{
                id: 46421532,
                scenarios: [23452343,23452345]
            }]);
        var runningStories = runnerService.getRunningSessions();
        expect(runningStories[0].title).to.equal(runningStories[0].progress.stories[0].title);
    });

    it('should use the title of the most expensive story as a base for a multistory title', function () {
        startStories([
            {id: 46421532, scenarios: [23452345]},
            {id: 56421532, scenarios: [33452343,33452345]}
        ]);
        var runningStories = runnerService.getRunningSessions();
        expect(runningStories[0].title).to.equal(runningStories[0].progress.stories[1].title);
    });

});
