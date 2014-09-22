/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: FeedbackService initialization', function() {

    var feedbackService,
        broadcastSpy,
        EVENTS,
        FEEDBACK;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function (feedback,$rootScope,_FEEDBACK_,_EVENTS_) {
        feedbackService = feedback;
        FEEDBACK = _FEEDBACK_;
        EVENTS = _EVENTS_;
        broadcastSpy = sinon.spy($rootScope, '$broadcast');
    }));

    it('should publish an event for error feedback', function () {
        var message = 'test';
        feedbackService.error(message);
        broadcastSpy.should.have.been.calledWith(EVENTS.FEEDBACK,{
            message: message,
            type: FEEDBACK.TYPE.ERROR,
            timeout: undefined
        });
    });

    it('should publish an event for success feedback', function () {
        var message = 'test';
        feedbackService.success(message);
        broadcastSpy.should.have.been.calledWith(EVENTS.FEEDBACK,{
            message: message,
            type: FEEDBACK.TYPE.SUCCESS,
            timeout: undefined
        });
    });

    it('should publish an event for alert feedback', function () {
        var message = 'test';
        feedbackService.alert(message);
        broadcastSpy.should.have.been.calledWith(EVENTS.FEEDBACK,{
            message: message,
            type: FEEDBACK.TYPE.ALERT,
            timeout: undefined
        });
    });

    it('should publish an event for notice feedback', function () {
        var message = 'test';
        feedbackService.notice(message);
        broadcastSpy.should.have.been.calledWith(EVENTS.FEEDBACK,{
            message: message,
            type: FEEDBACK.TYPE.NOTICE,
            timeout: undefined
        });
    });

    it('should publish an event for notice feedback with a specified timeout', function () {
        var message = 'test';
        feedbackService.notice(message,3000);
        broadcastSpy.should.have.been.calledWith(EVENTS.FEEDBACK,{
            message: message,
            type: FEEDBACK.TYPE.NOTICE,
            timeout: 3000
        });
    });

});
