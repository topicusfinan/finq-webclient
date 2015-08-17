'use strict';

describe('Unit: FeedbackCtrl', function() {

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
    beforeEach(inject(function ($controller, _$timeout_, $httpBackend, $rootScope, $config, _EVENTS_, _FEEDBACK_) {
        scope = $rootScope.$new();
        backend = $httpBackend;
        $timeout = _$timeout_;
        configProvider = $config;
        EVENTS = _EVENTS_;
        FEEDBACK = _FEEDBACK_;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            feedback: {
                replaceTime: 10,
                cleanTimeout: 30,
                queueTimeout: 20,
                minTimeout: 10
            }
        });
        $httpBackend.expectGET('/app').respond(200);
        $config.load().then(function() {
            FeedbackCtrl = $controller('FeedbackCtrl', {$scope: scope});
        });
        $httpBackend.flush();
    }));

    it('should initially set its variables properly', function () {
        expect(FeedbackCtrl.show).to.be.false();
        expect(FeedbackCtrl.feedback).to.deep.equal({
            message: '',
            type: ''
        });
    });

    it('should respond to a show feedback event', function () {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test'},
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        expect(FeedbackCtrl.show).to.be.true();
        expect(FeedbackCtrl.feedback).to.deep.equal({
            message: 'test (untranslated)',
            reference: 'test',
            type: FEEDBACK.CLASS.ERROR,
            data: undefined,
            tpl: {key: 'test'}
        });
    });

    it('should respond to a show feedback event with a specific timeout by using that timeout', function (done) {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test'},
            type: FEEDBACK.TYPE.ERROR,
            timeout: 5
        });
        $timeout.flush();
        setTimeout(function() {
            expect(FeedbackCtrl.show).to.be.false();
            done();
        },10);
    });

    it('should respond to a hide feedback request by hiding the feedback', function () {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test'},
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        FeedbackCtrl.hide();
        expect(FeedbackCtrl.show).to.be.false();
    });

    it('should hide feedback after the default amount of time in case not otherwise specified', function (done) {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test'},
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        setTimeout(function() {
            expect(FeedbackCtrl.show).to.be.true();
        },25);
        setTimeout(function() {
            expect(FeedbackCtrl.show).to.be.false();
            done();
        },35);
    });

    it('should queue a secondary feedback request and not immediately show it', function () {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test'},
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test2'},
            type: FEEDBACK.TYPE.SUCCESS
        });
        expect(FeedbackCtrl.show).to.be.true();
        expect(FeedbackCtrl.feedback).to.deep.equal({
            message: 'test (untranslated)',
            reference: 'test',
            type: FEEDBACK.CLASS.ERROR,
            data: undefined,
            tpl: {key: 'test'}
        });
    });

    it('should show queued feedback after the minimum amount of time in case of non notice queued feedback', function (done) {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test'},
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test2'},
            type: FEEDBACK.TYPE.SUCCESS
        });
        setTimeout(function() {
            $timeout.flush();
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test2 (untranslated)',
                reference: 'test2',
                type: FEEDBACK.CLASS.SUCCESS,
                data: undefined,
                tpl: {key: 'test2'}
            });
            done();
        },15);
    });

    it('should show queued feedback after the standard queue amount of time in case of notice queued feedback', function (done) {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test'},
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test2'},
            type: FEEDBACK.TYPE.NOTICE
        });
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test3'},
            type: FEEDBACK.TYPE.NOTICE
        });
        setTimeout(function() {
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test (untranslated)',
                reference: 'test',
                type: FEEDBACK.CLASS.ERROR,
                data: undefined,
                tpl: {key: 'test'}
            });
        },15);
        setTimeout(function() {
            $timeout.flush();
        },25);
        setTimeout(function() {
            try {
                // we should not have a timeout to flush here because the next notice in line is not to be shown yet
                $timeout.flush();
            } catch (error) {
                expect(error).to.not.be.null();
                done();
            }
        },45);
    });

    it('should adjust the timeout for queued feedback depending on the next item in the queue line', function (done) {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test'},
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test2'},
            type: FEEDBACK.TYPE.SUCCESS
        });
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test3'},
            type: FEEDBACK.TYPE.ERROR
        });
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test4'},
            type: FEEDBACK.TYPE.NOTICE
        });
        setTimeout(function() {
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test (untranslated)',
                reference: 'test',
                type: FEEDBACK.CLASS.ERROR,
                data: undefined,
                tpl: {key: 'test'}
            });
        },15);
        setTimeout(function() {
            $timeout.flush();
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test2 (untranslated)',
                reference: 'test2',
                type: FEEDBACK.CLASS.SUCCESS,
                data: undefined,
                tpl: {key: 'test2'}
            });
        },25);
        setTimeout(function() {
            $timeout.flush();
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test3 (untranslated)',
                reference: 'test3',
                type: FEEDBACK.CLASS.ERROR,
                data: undefined,
                tpl: {key: 'test3'}
            });
        },48);
        setTimeout(function() {
            try {
                // we should not have a timeout to flush here because the next notice in line is not to be shown yet
                $timeout.flush();
            } catch (error) {}
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test3 (untranslated)',
                reference: 'test3',
                type: FEEDBACK.CLASS.ERROR,
                data: undefined,
                tpl: {key: 'test3'}
            });
        },60);
        setTimeout(function() {
            $timeout.flush();
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test4 (untranslated)',
                reference: 'test4',
                type: FEEDBACK.CLASS.NOTICE,
                data: undefined,
                tpl: {key: 'test4'}
            });
            done();
        },82);
    });

    it('should replace feedback in case the current feedback is of the same type as a new feedback message that is pushed and there is no queue', function (done) {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test'},
            type: FEEDBACK.TYPE.ERROR,
            data: {count: 1}
        });
        $timeout.flush();
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test'},
            type: FEEDBACK.TYPE.ERROR,
            data: {count: 2}
        });
        setTimeout(function() {
            $timeout.flush();
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test (untranslated)',
                reference: 'test',
                type: FEEDBACK.CLASS.ERROR,
                data: {count: 2},
                tpl: {key: 'test'}
            });
            done();
        },15);
    });

    it('should show queued feedback after the standard queue amount of time in case of non notice queued feedback', function (done) {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test'},
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test2'},
            type: FEEDBACK.TYPE.NOTICE
        });
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test3'},
            type: FEEDBACK.TYPE.SUCCESS
        });
        setTimeout(function() {
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test (untranslated)',
                reference: 'test',
                type: FEEDBACK.CLASS.ERROR,
                data: undefined,
                tpl: {key: 'test'}
            });
        },15);
        setTimeout(function() {
            // we should have a timeout here because the next in line is a success message that takes higher precedence than a notice
            $timeout.flush();
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test3 (untranslated)',
                reference: 'test3',
                type: FEEDBACK.CLASS.SUCCESS,
                data: undefined,
                tpl: {key: 'test3'}
            });
            done();
        },25);
    });

    it('should increment values in a queued feedback item in case it supports this', function (done) {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test'},
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {
                key: 'test2',
                incrementable: true
            },
            type: FEEDBACK.TYPE.SUCCESS,
            data: {count: 3, desc: 'test2'}
        });
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {
                key: 'test2',
                incrementable: true
            },
            type: FEEDBACK.TYPE.SUCCESS,
            data: {count: 4, desc: 'test2'}
        });
        setTimeout(function() {
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test (untranslated)',
                reference: 'test',
                type: FEEDBACK.CLASS.ERROR,
                data: undefined,
                tpl: {key: 'test'}
            });
        },15);
        setTimeout(function() {
            // we should have a timeout here because the next in line is a success message that takes higher precedence than a notice
            $timeout.flush();
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test2 (untranslated)',
                reference: 'test2',
                type: FEEDBACK.CLASS.SUCCESS,
                data: {count: 7, desc: 'test2'},
                tpl: {
                    key: 'test2',
                    incrementable: true
                }
            });
            done();
        },25);
    });

    it('should not increment values in a queued feedback item in case there is a variable that does not support this', function (done) {
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {key: 'test'},
            type: FEEDBACK.TYPE.ERROR
        });
        $timeout.flush();
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {
                key: 'test2',
                incrementable: true
            },
            type: FEEDBACK.TYPE.SUCCESS,
            data: {count: 3, desc: 'test2'}
        });
        scope.$emit(EVENTS.SCOPE.FEEDBACK,{
            message: {
                key: 'test2',
                incrementable: true
            },
            type: FEEDBACK.TYPE.SUCCESS,
            data: {count: 4, desc: 'test3'}
        });
        setTimeout(function() {
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test (untranslated)',
                reference: 'test',
                type: FEEDBACK.CLASS.ERROR,
                data: undefined,
                tpl: {key: 'test'}
            });
        },15);
        setTimeout(function() {
            // we should have a timeout here because the next in line is a success message that takes higher precedence than a notice
            $timeout.flush();
            expect(FeedbackCtrl.feedback).to.deep.equal({
                message: 'test2 (untranslated)',
                reference: 'test2',
                type: FEEDBACK.CLASS.SUCCESS,
                data: {count: 4, desc: 'test3'},
                tpl: {
                    key: 'test2',
                    incrementable: true
                }
            });
            done();
        },25);
    });

});
