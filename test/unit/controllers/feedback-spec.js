'use strict';

describe('Unit: FeedbackCtrl initialization', function() {

    var FeedbackCtrl,
        scope,
        $timeout,
        configProvider,
        EVENTS,
        FEEDBACK,
        backend;

    beforeEach(function() {
        module('finqApp');
    });
    beforeEach(inject(function ($controller, _$timeout_, $httpBackend, $rootScope, config, _EVENTS_, _FEEDBACK_) {
        scope = $rootScope.$new();
        backend = $httpBackend;
        $timeout = _$timeout_;
        configProvider = config;
        EVENTS = _EVENTS_;
        FEEDBACK = _FEEDBACK_;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            feedbackTimeout: 30,
            feedbackQueueTimeout: 20,
            minFeedbackTimeout: 10
        });
        $httpBackend.expectGET('/app/info').respond(200);
        config.load().then(function() {
            FeedbackCtrl = $controller('FeedbackCtrl', {$scope: scope});
        });
        $httpBackend.flush();
    }));

    it('should initially set its variables properly', function () {
        expect(FeedbackCtrl.show).to.be.false;
        expect(FeedbackCtrl.feedback).to.deep.equal({
            message: '',
            type: ''
        });
    });

    it('should respond to a show feedback event', function () {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test',
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        expect(FeedbackCtrl.show).to.be.true;
        expect(FeedbackCtrl.feedback).to.deep.equal({
            message: 'test (untranslated)',
            type: FEEDBACK.CLASS.ERROR
        });
    });

    it('should respond to a hide feedback request by hiding the feedback', function () {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test',
            type: FEEDBACK.TYPE.ERROR
        });
        FeedbackCtrl.hide();
        expect(FeedbackCtrl.show).to.be.false;
    });

    it('should hide feedback after the default amount of time in case not otherwise specified', function (done) {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test',
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        setTimeout(function() {

            expect(FeedbackCtrl.show).to.be.true;
        },25);
        setTimeout(function() {
            expect(FeedbackCtrl.show).to.be.false;
            done();
        },35);
    });

    it('should queue a secondary feedback request and not immediately show it', function () {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test',
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test2',
            type: FEEDBACK.TYPE.SUCCESS
        });
        expect(FeedbackCtrl.show).to.be.true;
        expect(FeedbackCtrl.feedback).to.deep.equal({
            message: 'test (untranslated)',
            type: FEEDBACK.CLASS.ERROR
        });
    });

    it('should show queued feedback after the minimum amount of time in case of non notice queued feedback', function (done) {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test',
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test2',
            type: FEEDBACK.TYPE.SUCCESS
        });
        setTimeout(function() {
            $timeout.flush();
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test2 (untranslated)',
                type: FEEDBACK.CLASS.SUCCESS
            });
            done();
        },15);
    });

    it('should show queued feedback after the standard queue amount of time in case of notice queued feedback', function (done) {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test',
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test2',
            type: FEEDBACK.TYPE.NOTICE
        });
        setTimeout(function() {
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test (untranslated)',
                type: FEEDBACK.CLASS.ERROR
            });
        },15);
        setTimeout(function() {
            $timeout.flush();
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test2 (untranslated)',
                type: FEEDBACK.CLASS.NOTICE
            });
            done();
        },25);
    });

});
