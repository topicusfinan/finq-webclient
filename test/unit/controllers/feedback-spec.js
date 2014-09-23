'use strict';

describe('Unit: FeedbackCtrl initialization', function() {

    var FeedbackCtrl,
        scope,
        configProvider,
        EVENTS,
        FEEDBACK,
        backend;

    beforeEach(function() {
        module('finqApp');
    });
    beforeEach(inject(function ($controller, $httpBackend, $rootScope, config, _EVENTS_, _FEEDBACK_) {
        scope = $rootScope.$new();
        backend = $httpBackend;
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
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test2',
            type: FEEDBACK.TYPE.SUCCESS
        });
        setTimeout(function() {
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
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test2 (untranslated)',
                type: FEEDBACK.CLASS.NOTICE
            });
            done();
        },25);
    });

    it('should hasten the rendering of queued feedback in case the next queued feedback is not a notice', function (done) {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test',
            type: FEEDBACK.TYPE.ERROR
        });
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test2',
            type: FEEDBACK.TYPE.NOTICE
        });
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test3',
            type: FEEDBACK.TYPE.SUCCESS
        });
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: 'test4',
            type: FEEDBACK.TYPE.NOTICE
        });
        setTimeout(function() {
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test2 (untranslated)',
                type: FEEDBACK.CLASS.NOTICE
            });
        },15);
        setTimeout(function() {
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test3 (untranslated)',
                type: FEEDBACK.CLASS.SUCCESS
            });
        },25);
        setTimeout(function() {
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test3 (untranslated)',
                type: FEEDBACK.CLASS.SUCCESS
            });
        },35);
        setTimeout(function() {
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test4 (untranslated)',
                type: FEEDBACK.CLASS.NOTICE
            });
            done();
        },45);
    });

});
