/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: StoryRun service', function() {

    var storyRunService,
        feedbackService,
        FEEDBACK,
        backend;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($httpBackend, storyRun, feedback, _FEEDBACK_) {
        backend = $httpBackend;
        storyRunService = storyRun;
        feedbackService = feedback;
        FEEDBACK = _FEEDBACK_;
    }));

    it('should subscribe to the progress of a scenario run in case of a successful run initialization of a single scenario', function () {
        backend.expectPOST('/story/run').respond(200, {id: 1});
        var feedbackSpy = sinon.spy(feedbackService, 'success');
        storyRunService.runStory({story: 1,scenarios: [1]}, 1);
        backend.flush();
        feedbackSpy.should.have.been.calledWith(FEEDBACK.SUCCESS.RUN.SINGLE_REQUEST);
    });

    it('should subscribe to the progress of a scenario run in case of a successful run initialization of multiple scenarios', function () {
        backend.expectPOST('/story/run').respond(200, {id: 1});
        var feedbackSpy = sinon.spy(feedbackService, 'success');
        storyRunService.runStories([
            {story: 1,scenarios: [1]},
            {story: 2,scenarios: [2]}
        ], 1);
        backend.flush();
        feedbackSpy.should.have.been.calledWith(FEEDBACK.SUCCESS.RUN.MULTIPLE_REQUEST,{count: 2, environment: null});
    });

    it('should respond to a failed attempt to run a scenario by showing the user feedback', function () {
        backend.expectPOST('/story/run').respond(503, 'fail to run as expected');
        var feedbackSpy = sinon.spy(feedbackService, 'error');
        storyRunService.runStory({story: 1,scenarios: [1]}, 1);
        backend.flush();
        feedbackSpy.should.have.been.calledWith(FEEDBACK.ERROR.RUN.REQUEST_FAILED);
    });

    it('should not attempt to run an empty scenario set, but instead show an alert', function () {
        var feedbackSpy = sinon.spy(feedbackService, 'alert');
        storyRunService.runStories([]);
        feedbackSpy.should.have.been.calledWith(FEEDBACK.ALERT.RUN.NO_SCENARIOS_SELECTED);
    });

});
