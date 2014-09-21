/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: PageService', function() {

    var pageService;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($httpBackend, page) {
        pageService = page;
    }));

    it('should initially not have an active module or section', function () {
        var activeSection = pageService.getActiveSection();
        expect(activeSection.moduleId).to.be.null;
        expect(activeSection.sectionId).to.be.null;
    });

    it('should initially not have an active module or section', function () {
        pageService.setActiveSection({id: 'a'},{id: 'b'});
        var activeSection = pageService.getActiveSection();
        expect(activeSection.moduleId).to.equal('a');
        expect(activeSection.sectionId).to.equal('b');
    });

    it('should be able to generate a new page title without a controller title', function () {
        var title = pageService.getPageTitle('Finq');
        expect(title).to.equal('Finq');
    });

    it('should be able to generate a new page title with a controller title', function () {
        var title = pageService.getPageTitle('Finq','Test');
        expect(title).to.equal('Finq - Test');
    });

});
