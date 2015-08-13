/**
 * Created by c.kramer on 9/9/2014.
 */
/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: ReportSearch initialization', function() {

    var reportSearchService,
        MODULES,
        EVENTS;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function (_EVENTS_, _MODULES_, $httpBackend, $config, $reportSearch) {
        MODULES = _MODULES_;
        EVENTS = _EVENTS_;
        reportSearchService = $reportSearch;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            maxSearchResults: 1000
        });
        $httpBackend.expectGET('/app').respond(200);
        $config.load().then(function() {
            reportSearchService.initialize([
                {title: 'story test'},
                {title: 'book test'}
            ]);
        });
        $httpBackend.flush();
    }));

    it('should make it possible to search for a report after initialization of a report list', function () {
        var reportIds = reportSearchService.suggest('story');
        expect(reportIds.length).to.equal(1);
    });

    it('should return multiple books in case a search is executed that matches multiple books', function () {
        var storybookIds = reportSearchService.suggest('test');
        expect(storybookIds.length).to.equal(2);
    });

    it('should not reinitialize in case not forced to do so', function () {
        reportSearchService.initialize([]);
        var storybookIds = reportSearchService.suggest('test');
        expect(storybookIds.length).to.equal(2);
    });

    it('should reinitialize in case it is forced to do so', function () {
        reportSearchService.initialize([],true);
        var storybookIds = reportSearchService.suggest('test');
        expect(storybookIds.length).to.equal(0);
    });

});
