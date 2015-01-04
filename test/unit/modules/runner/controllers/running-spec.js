/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: RunningCtrl', function() {

    var RunningCtrl,
        configProvider,
        moduleSpy,
        MODULES,
        runnerService,
        storyMockData,
        environmentMockData,
        EVENTS,
        STATE,
        $timeout,
        scope;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, config, _module_, _STATE_, _MODULES_, _EVENTS_, runner, _$timeout_, story, storyServiceMock, environment, environmentServiceMock) {
        scope = $rootScope.$new();
        MODULES = _MODULES_;
        EVENTS = _EVENTS_;
        STATE = _STATE_;
        $timeout = _$timeout_;
        storyMockData = storyServiceMock.books;
        environmentMockData = environmentServiceMock.environments;
        configProvider = config;
        runnerService = runner;
        moduleSpy = sinon.spy(_module_, 'setCurrentSection');
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            run: {
                updateInterval: 10,
                pagination: {server: {runsPerRequest: 2}}
            },
            socket: {endpoint: '', mocked: true},
            selectDropdown: {pagination: {itemsPerPage: 4}}
        });
        $httpBackend.expectGET('/app').respond(200);
        $httpBackend.expectGET('/environments').respond(200, environmentMockData);
        $httpBackend.expectGET('/books').respond(200, storyMockData);
        $httpBackend.expectGET('/runs?status='+STATE.RUN.SCENARIO.RUNNING+'&size=2&page=0').respond(200, []);
        config.load().then(function() {
            environment.list();
            RunningCtrl = $controller('RunningCtrl', {$scope: scope});
        });
        $httpBackend.flush();
    }));
    afterEach(function() {
        scope.$emit('$destroy');
    });

    it('should initially not have any item selected', function () {
        expect(RunningCtrl.selectedItem).to.be.null;
    });

    it('should initially set the maximum selectable items for a dropdown to the standard configured value', function () {
        expect(RunningCtrl.maxSelectItems).to.equal(configProvider.client().selectDropdown.pagination.itemsPerPage);
    });

    it('should register itself as the active module and section', function () {
        expect(moduleSpy).to.have.been.calledWith(MODULES.RUNNER.sections.RUNNING);
    });

    it('should respond to an update environment request by setting the environment keys', function () {
        var envEventData = {id: 'env', keys: [1], keysFull: [1]};
        scope.$emit(EVENTS.SCOPE.FILTER_SELECT_UPDATED,envEventData);
        expect(RunningCtrl.filter.env.ids).to.deep.equal(envEventData.keys);
    });

    it('should initially have an empty list of runs', function () {
        expect(scope.runs().length).to.equal(0);
    });

    it('should be able to explicitly purge completed stories on request', function () {
        var clearSessionsSpy = sinon.spy(runnerService, 'clearCompletedSessions');
        RunningCtrl.purge();
        clearSessionsSpy.should.have.been.called.once;
    });

    it('should update its runs in case the runservice has changed its runs', function (done) {
        runnerService.handle(EVENTS.INTERNAL.STORY_RUN_STARTED, {
            id: 1,
            environment: environmentMockData[0],
            startedOn: new Date(),
            stories: [{
                id: 46421532,
                scenarios: [{id:23452343},{id:23452345}]
            }]
        });
        setTimeout(function() {
            $timeout.flush();
            expect(scope.runs().length).to.equal(1);
            expect(scope.runs()[0].environment).to.deep.equal(environmentMockData[0]);
            expect(scope.runs()[0].runtime).to.equal('00:00');
            expect(scope.runs()[0].percentage).to.equal(0);
            expect(scope.runs()[0].highlight).to.equal('none');
            expect(scope.runs()[0].stories[0].percentage).to.equal(0);
            expect(scope.runs()[0].stories[0].highlight).to.equal('none');
            done();
        },14);
    });

    it('should update the progress information of its runs in case the progress of runs was updated and a run failed', function (done) {
        runnerService.handle(EVENTS.INTERNAL.STORY_RUN_STARTED, {
            id: 1,
            environment: environmentMockData[0],
            startedOn: new Date(),
            stories: [{
                id: 46421532,
                scenarios: [{id:23452343},{id:23452345}]
            }]
        });
        runnerService.handle(EVENTS.SOCKET.RUN.UPDATED, {
            id: 1,
            status: STATE.RUN.SCENARIO.FAILED,
            story: {
                id: 46421532,
                status: STATE.RUN.SCENARIO.FAILED,
                scenario: {
                    id: 23452343,
                    status: STATE.RUN.SCENARIO.FAILED,
                    steps: [
                        {status: STATE.RUN.SCENARIO.SUCCESS},
                        {status: STATE.RUN.SCENARIO.FAILED, message: 'A failure message'},
                        {status: STATE.RUN.SCENARIO.QUEUED}]
                }
            }
        });
        setTimeout(function() {
            $timeout.flush();
            expect(scope.runs()[0].percentage).to.equal(48);
            expect(scope.runs()[0].highlight).to.equal('failed');
            expect(scope.runs()[0].stories[0].percentage).to.equal(48);
            expect(scope.runs()[0].stories[0].scenarios[0].message).to.equal('A failure message');
            expect(scope.runs()[0].stories[0].highlight).to.equal('failed');
            expect(scope.runs()[0].stories[0].scenarios[0].percentage).to.equal(64);
            done();
        },14);
    });

    it('should update the progress information of its runs in case the progress of runs was updated and a run completed successfully', function (done) {
        runnerService.handle(EVENTS.INTERNAL.STORY_RUN_STARTED, {
            id: 1,
            environment: environmentMockData[0],
            startedOn: new Date(),
            stories: [{
                id: 46421532,
                scenarios: [{id:23452343},{id:23452345}]
            }]
        });
        runnerService.handle(EVENTS.SOCKET.RUN.UPDATED, {
            id: 1,
            status: STATE.RUN.SCENARIO.SUCCESS,
            story: {
                id: 46421532,
                status: STATE.RUN.SCENARIO.SUCCESS,
                scenario: {
                    id: 23452343,
                    status: STATE.RUN.SCENARIO.SUCCESS,
                    steps: [
                        {status: STATE.RUN.SCENARIO.SUCCESS},
                        {status: STATE.RUN.SCENARIO.SUCCESS},
                        {status: STATE.RUN.SCENARIO.SUCCESS}]
                }
            }
        });
        setTimeout(function() {
            $timeout.flush();
            expect(scope.runs()[0].percentage).to.equal(48);
            expect(scope.runs()[0].highlight).to.equal('success');
            expect(scope.runs()[0].stories[0].percentage).to.equal(48);
            expect(scope.runs()[0].stories[0].scenarios[0].message).to.equal('');
            expect(scope.runs()[0].stories[0].highlight).to.equal('success');
            expect(scope.runs()[0].stories[0].scenarios[0].percentage).to.equal(100);
            done();
        },14);
    });

    it('should update the progress information of its runs in case the progress of runs was updated and a run is not complete', function (done) {
        runnerService.handle(EVENTS.INTERNAL.STORY_RUN_STARTED, {
            id: 1,
            environment: environmentMockData[0],
            startedOn: new Date(),
            stories: [{
                id: 46421532,
                scenarios: [{id:23452343},{id:23452345}]
            }]
        });
        runnerService.handle(EVENTS.SOCKET.RUN.UPDATED, {
            id: 1,
            status: STATE.RUN.SCENARIO.RUNNING,
            story: {
                id: 46421532,
                status: STATE.RUN.SCENARIO.RUNNING,
                scenario: {
                    id: 23452343,
                    status: STATE.RUN.SCENARIO.RUNNING,
                    steps: [
                        {status: STATE.RUN.SCENARIO.SUCCESS},
                        {status: STATE.RUN.SCENARIO.RUNNING},
                        {status: STATE.RUN.SCENARIO.QUEUED}]
                }
            }
        });
        setTimeout(function() {
            $timeout.flush();
            expect(scope.runs()[0].percentage).to.equal(0);
            expect(scope.runs()[0].highlight).to.equal('none');
            expect(scope.runs()[0].stories[0].percentage).to.equal(0);
            expect(scope.runs()[0].stories[0].scenarios[0].message).to.equal(scope.runs()[0].stories[0].scenarios[0].steps[1].title);
            expect(scope.runs()[0].stories[0].highlight).to.equal('none');
            expect(scope.runs()[0].stories[0].scenarios[0].percentage).to.equal(32);
            done();
        },14);
    });


});
