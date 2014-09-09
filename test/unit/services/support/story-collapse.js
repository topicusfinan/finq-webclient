/**
 * Created by c.kramer on 9/9/2014.
 */
/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: AvailableCtrl initialization', function() {

    var storyCollapseService,
        MODULES,
        EVENTS,
        scope,
        storybooks;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, _EVENTS_, _MODULES_, storyCollapse, storyServiceMock) {
        scope = $rootScope.$new();
        MODULES = _MODULES_;
        EVENTS = _EVENTS_;
        storybooks = storyServiceMock.books;
        storyCollapseService = storyCollapse;
        storyCollapseService.initialize(storybooks);
    }));

    it('should collapse all stories in a book on request when expanded separately and collapsed collectively', function () {
        storyCollapseService.expandStory(storybooks[0].id,storybooks[0].stories[0].id);
        storyCollapseService.toggleExpand('book',storybooks[0].id);
        expect(storyCollapseService.getExpand()).to.be.null;
        expect(storyCollapseService.getBooks()[0].stories[0].expand).to.be.false;
    });

    it('should keep an other book expanded in case a book is collectively collapsed when it was expanded separately', function () {
        storyCollapseService.toggleExpand('book',storybooks[1].id);
        storyCollapseService.expandStory(storybooks[0].id,storybooks[0].stories[0].id);
        storyCollapseService.toggleExpand('book',storybooks[0].id);
        expect(storyCollapseService.getExpand()).to.equal('book'+storybooks[1].id);
        expect(storyCollapseService.getBooks()[0].stories[0].expand).to.be.false;
    });

    it('should collapse all stories in case they were expanded separately but all books are collapsed collectively', function () {
        storyCollapseService.toggleExpand('book',storybooks[1].id);
        storyCollapseService.expandStory(storybooks[0].id,storybooks[0].stories[0].id);
        storyCollapseService.toggleExpand('all');
        expect(storyCollapseService.getExpand()).to.equal(null);
        expect(storyCollapseService.getBooks()[0].stories[0].expand).to.be.false;
    });

});
