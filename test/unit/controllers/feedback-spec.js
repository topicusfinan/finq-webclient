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
            feedbackTimeout : 2000
        });
        $httpBackend.expectGET('/app/info').respond(200);
        config.load().then(function() {
            FeedbackCtrl = $controller('FeedbackCtrl', {$scope: scope});
        });
        $httpBackend.flush();
    }));

    it('should initially set its variables properly', function () {
        expect(FeedbackCtrl.show).to.be.false;
        expect(FeedbackCtrl.defaultTimeout).to.equal(configProvider.client().feedbackTimeout);
        expect(FeedbackCtrl.feedback).to.deep.equal({
            message: '',
            type: ''
        });
    });

    it('should respond to a show feedback event', function () {
        scope.$emit(EVENTS.FEEDBACK,{
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
        scope.$emit(EVENTS.FEEDBACK,{
            message: 'test',
            type: FEEDBACK.TYPE.ERROR
        });
        FeedbackCtrl.hide();
        expect(FeedbackCtrl.show).to.be.false;
    });

});
