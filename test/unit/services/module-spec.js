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
    beforeEach(inject(function (_$rootScope_, _MODULES_, _EVENTS_, module, runner) {
        $rootScope = _$rootScope_;
        moduleService = module;
        runnerService = runner;
        EVENTS = _EVENTS_;
        MODULES = _MODULES_;
    }));

    it('should trigger the handling of events by linked module services', function () {
        var handleSpy = sinon.spy(runnerService, 'handle');
        moduleService.linkModule(MODULES.RUNNER,runnerService);
        moduleService.handleEvent(EVENTS.INTERNAL.SCENARIO_RUN_STARTED,{scenarios: []});
        handleSpy.should.have.been.called.once;
    });

    it('should trigger a section notifications update event', function () {
        var broadcastSpy = sinon.spy($rootScope, '$broadcast');
        moduleService.updateSectionBadge(MODULES.RUNNER.sections.AVAILABLE,1);
        broadcastSpy.should.have.been.calledWith(EVENTS.SCOPE.SECTION_NOTIFICATIONS_UPDATED,{
            section: MODULES.RUNNER.sections.AVAILABLE,
            count: 1
        });
    });

    it('should trigger a module notifications update event', function () {
        var broadcastSpy = sinon.spy($rootScope, '$broadcast');
        moduleService.updateModuleBadge(MODULES.RUNNER,1);
        broadcastSpy.should.have.been.calledWith(EVENTS.SCOPE.MODULE_NOTIFICATIONS_UPDATED,{
            module: MODULES.RUNNER,
            count: 1
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
