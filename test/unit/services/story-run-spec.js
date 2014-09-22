/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: StoryRun service', function() {

    var storyRunService,
        subscriptionService,
        feedbackService,
        FEEDBACK,
        backend;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($httpBackend, storyRun, subscription, feedback, _FEEDBACK_) {
        backend = $httpBackend;
        storyRunService = storyRun;
        subscriptionService = subscription;
        feedbackService = feedback;
        FEEDBACK = _FEEDBACK_;
    }));

    it('should subscribe to the progress of a scenario run in case of a successful run initialization of a single scenario', function () {
        backend.expectGET('/story/run').respond(200, {id: 1});
        backend.expectGET('/subscription/subscribe').respond(503,'subscribing failed as expected');
        var subscribeSpy = sinon.spy(subscriptionService, 'subscribe');
        var feedbackSpy = sinon.spy(feedbackService, 'success');
        storyRunService.runScenario(1);
        backend.flush();
        expect(subscribeSpy).to.have.been.calledWith(1);
        expect(feedbackSpy).to.have.been.calledWith(FEEDBACK.SUCCESS.RUN.SINGLE_REQUEST);
    });

    it('should subscribe to the progress of a scenario run in case of a successful run initialization of multiple scenarios', function () {
        backend.expectGET('/story/run').respond(200, {id: 1});
        backend.expectGET('/subscription/subscribe').respond(503,'subscribing failed as expected');
        var subscribeSpy = sinon.spy(subscriptionService, 'subscribe');
        var feedbackSpy = sinon.spy(feedbackService, 'success');
        storyRunService.runScenarios([1,2]);
        backend.flush();
        expect(subscribeSpy).to.have.been.calledWith(1);
        expect(feedbackSpy).to.have.been.calledWith(FEEDBACK.SUCCESS.RUN.MULTIPLE_REQUEST,{count: 2});
    });

    it('should respond to a failed attempt to run a scenario by showing the user feedback', function () {
        backend.expectGET('/story/run').respond(503, 'fail to run as expected');
        var feedbackSpy = sinon.spy(feedbackService, 'error');
        storyRunService.runScenario(1);
        backend.flush();
        expect(feedbackSpy).to.have.been.calledWith(FEEDBACK.ERROR.RUN.REQUEST_FAILED);
    });

    it('should not attempt to run an empty scenario set, but instead show an alert', function () {
        var feedbackSpy = sinon.spy(feedbackService, 'alert');
        storyRunService.runScenarios([]);
        expect(feedbackSpy).to.have.been.calledWith(FEEDBACK.ALERT.RUN.NO_SCENARIOS_SELECTED);
    });

});
