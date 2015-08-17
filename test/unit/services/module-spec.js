/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: ModuleService', function() {

    var moduleService,
        $rootScope,
        runnerService,
        MODULES,
        EVENTS;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, _$rootScope_, _MODULES_, _EVENTS_, $module, $runner, $config) {
        $rootScope = _$rootScope_;
        moduleService = $module;
        runnerService = $runner;
        EVENTS = _EVENTS_;
        MODULES = _MODULES_;
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
        $config.load();
        $httpBackend.flush();

    }));

    it('should trigger the handling of events by linked module services', function () {
        var handleSpy = sinon.spy(runnerService, 'handle');
        moduleService.linkModule(MODULES.RUNNER,runnerService);
        moduleService.handleEvent(EVENTS.INTERNAL.SCENARIO_RUN_STARTED,{scenarios: []});
        handleSpy.should.have.been.calledOnce;
    });

    it('should trigger a section notifications update event', function () {
        var broadcastSpy = sinon.spy($rootScope, '$broadcast');
        moduleService.updateSectionBadge(MODULES.RUNNER.sections.AVAILABLE,[1],true);
        broadcastSpy.should.have.been.calledWith(EVENTS.SCOPE.SECTION_NOTIFICATIONS_UPDATED,{
            id: MODULES.RUNNER.sections.AVAILABLE.id,
            identifiers: [1],
            add: true
        });
    });

    it('should trigger a module notifications update event', function () {
        var broadcastSpy = sinon.spy($rootScope, '$broadcast');
        moduleService.updateModuleBadge(MODULES.RUNNER,[1],true);
        broadcastSpy.should.have.been.calledWith(EVENTS.SCOPE.MODULE_NOTIFICATIONS_UPDATED,{
            id: MODULES.RUNNER.id,
            identifiers: [1],
            add: true
        });
    });

    it('should trigger an event when the current active section has changed', function () {
        var broadcastSpy = sinon.spy($rootScope, '$broadcast');
        moduleService.setCurrentSection(MODULES.RUNNER.sections.AVAILABLE);
        broadcastSpy.should.have.been.calledWith(EVENTS.SCOPE.SECTION_STATE_CHANGED,{
            module: MODULES.RUNNER,
            section: MODULES.RUNNER.sections.AVAILABLE
        });
    });

});
