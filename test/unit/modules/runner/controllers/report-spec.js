/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: ReportCtrl initialization', function() {

    var reportMockData,
        moduleSpy,
        MODULES,
        EVENTS,
        STATE,
        $controller,
        reportService,
        $httpBackend,
        scope;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function (_$controller_, $rootScope, _$httpBackend_, config, _module_, _STATE_, _MODULES_, _EVENTS_, reportServiceMock, report) {
        scope = $rootScope.$new();
        MODULES = _MODULES_;
        EVENTS = _EVENTS_;
        STATE = _STATE_;
        $controller = _$controller_;
        reportMockData = reportServiceMock;
        reportService = report;
        moduleSpy = sinon.spy(_module_, 'setCurrentSection');
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: ''
        });
        $httpBackend.expectGET('/app').respond(200);
        config.load();
        $httpBackend.flush();
    }));
    afterEach(function() {
        scope.$emit('$destroy');
    });

    it('should load the selected report in order to display its results', function () {
        var getReportSpy = sinon.spy(reportService, 'getReport');
        $httpBackend.expectGET('/runs/1').respond(200, reportMockData.data[0]);
        $controller('ReportCtrl', {
            $scope: scope,
            $routeParams: {reportId: reportMockData.data[0].id}
        });
        expect(getReportSpy).to.have.been.calledWith(reportMockData.data[0].id);
    });

});

describe('Unit: ReportCtrl', function() {

    var reportMockData,
        moduleSpy,
        getReportSpy,
        MODULES,
        EVENTS,
        STATE,
        $controller,
        ReportController,
        reportService,
        $httpBackend,
        location,
        scope;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function (_$controller_, $rootScope, $location, _$httpBackend_, config, _module_, _STATE_, _MODULES_, _EVENTS_, reportServiceMock, report) {
        scope = $rootScope.$new();
        MODULES = _MODULES_;
        EVENTS = _EVENTS_;
        STATE = _STATE_;
        $controller = _$controller_;
        reportMockData = reportServiceMock;
        reportService = report;
        location = $location;
        moduleSpy = sinon.spy(_module_, 'setCurrentSection');
        getReportSpy = sinon.spy(reportService, 'getReport');
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: ''
        });
        $httpBackend.expectGET('/app').respond(200);
        config.load().then(function() {
            ReportController = $controller('ReportCtrl', {
                $scope: scope,
                $routeParams: {reportId: reportMockData.data[0].id}
            });
        });
        $httpBackend.flush();
    }));
    afterEach(function() {
        scope.$emit('$destroy');
    });

    it('should register itself as the active module and section', function () {
        expect(moduleSpy).to.have.been.calledWith(MODULES.RUNNER.sections.REPORTS);
    });

    it('should load the selected report in order to display its results', function () {
        expect(getReportSpy).to.have.been.calledWith(reportMockData.data[0].id);
    });

    it('should be able to handle a request for navigation back to the report listing', function () {
        var locSpy = sinon.spy(location,'path');
        ReportController.list();
        locSpy.should.have.been.calledWith('/runner/reports');
    });

});
