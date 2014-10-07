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
        MODULES;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($httpBackend, module, runner, _EVENTS_, _MODULES_, story, storyServiceMock, subscription, config) {
        runnerService = runner;
        moduleService = module;
        storyMockData = storyServiceMock.books;
        backend = $httpBackend;
        EVENTS = _EVENTS_;
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
        $httpBackend.expectGET('/story/list').respond(200, storyMockData);
        config.load();
        story.list();
        $httpBackend.flush();
    }));

    it('should subscribe to updates for a run in case a run was started', function () {
        var subscribeSpy = sinon.spy(subscriptionService, 'subscribe');
        runnerService.handle(EVENTS.INTERNAL.STORY_RUN_STARTED, {
            reference: 1,
            story: {
                scenarios: [1,2]
            }
        });
        subscribeSpy.should.have.been.called.once;
    });

    it('should handle a progress update for a run that is subscribed to', function () {
        runnerService.handle(EVENTS.INTERNAL.STORY_RUN_STARTED, {
            id: 1,
            story: {
                scenarios: [1,2]
            }
        });
        runnerService.handle(EVENTS.INTERNAL.RUN_STATUS_UPDATED, {
            id: 1,
            progress: null
        });
        // TODO extend this test by validating if the progress was administered properly when that functionality has been built
    });

});
