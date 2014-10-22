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
            run: {updateInterval: 10},
            socket: {endpoint: ''},
            pagination : {maxScenarios : 2}
        });
        $httpBackend.expectGET('/app').respond(200);
        $httpBackend.expectGET('/books').respond(200, storyMockData);
        $httpBackend.expectGET('/environments').respond(200, environmentMockData);
        config.load().then(function() {
            story.list();
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

    it('should initially set the maximum selectable items for a dropdown to the standard confgured value', function () {
        expect(RunningCtrl.maxSelectItems).to.equal(configProvider.client().pagination.maxSelectDropdownItems);
    });

    it('should register itself as the active module and section', function () {
        expect(moduleSpy).to.have.been.calledWith(MODULES.RUNNER.sections.RUNNING);
    });

    it('should respond to an update environement request by setting the environment keys', function () {
        var envEventData = {id: 'env', keys: [1], keysFull: [1]};
        scope.$emit(EVENTS.SCOPE.FILTER_SELECT_UPDATED,envEventData);
        expect(RunningCtrl.filter.env.ids).to.deep.equal(envEventData.keys);
    });

    it('should initially have an empty list of runs', function () {
        expect(scope.runs().length).to.equal(0);
    });

    it('should update its runs in case the runservice has changed its runs', function (done) {
        runnerService.handle(EVENTS.INTERNAL.STORY_RUN_STARTED, {
            id: 1,
            environment: environmentMockData[0].id,
            startedOn: new Date(),
            stories: [{
                id: 46421532,
                scenarios: [23452343,23452345]
            }]
        });
        setTimeout(function() {
            $timeout.flush();
            expect(scope.runs().length).to.equal(1);
            expect(scope.runs()[0].msg.environment).to.equal(environmentMockData[0].name);
            expect(scope.runs()[0].msg.runtime).to.equal('00:00');
            expect(scope.runs()[0].progress.percentage).to.equal(0);
            expect(scope.runs()[0].progress.highlight).to.equal('none');
            expect(scope.runs()[0].progress.stories[0].progress.percentage).to.equal(0);
            expect(scope.runs()[0].progress.stories[0].progress.highlight).to.equal('none');
            done();
        },14);
    });

    it('should update the progress information of its runs in case the progress of runs was updated', function (done) {
        runnerService.handle(EVENTS.INTERNAL.STORY_RUN_STARTED, {
            id: 1,
            environment: environmentMockData[0].id,
            startedOn: new Date(),
            stories: [{
                id: 46421532,
                scenarios: [23452343,23452345]
            }]
        });
        runnerService.handle(EVENTS.SOCKET.RUN_STATUS_UPDATED, {
            id: 1,
            status: STATE.RUN.SCENARIO.FAILED,
            stories: [
                {
                    id: 46421532,
                    status: STATE.RUN.SCENARIO.FAILED,
                    scenarios: [
                        {
                            status: STATE.RUN.SCENARIO.FAILED,
                            steps: [{status: STATE.RUN.SCENARIO.SUCCESS},{status: STATE.RUN.SCENARIO.FAILED},{status: STATE.RUN.SCENARIO.QUEUED}]
                        },
                        {
                            status: STATE.RUN.SCENARIO.RUNNING,
                            steps: [{status: STATE.RUN.SCENARIO.SUCCESS},{status: STATE.RUN.SCENARIO.RUNNING},{status: STATE.RUN.SCENARIO.QUEUED},{status: STATE.RUN.SCENARIO.QUEUED}]
                        }
                    ]
                }
            ]
        });
        setTimeout(function() {
            $timeout.flush();
            expect(scope.runs()[0].progress.percentage).to.equal(48);
            expect(scope.runs()[0].progress.highlight).to.equal('failed');
            expect(scope.runs()[0].progress.stories[0].progress.percentage).to.equal(48);
            expect(scope.runs()[0].progress.stories[0].progress.highlight).to.equal('failed');
            done();
        },14);
    });

});
