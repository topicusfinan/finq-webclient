/**
 * Created by marc.fokkert on 16-3-2015.
 */
describe('Unit: Story Edit', function () {
    var storyEdit, $httpBackend, story, storyMockData;

    beforeEach(function () {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });

    beforeEach(inject(function (_storyEdit_, _$httpBackend_, _story_, storyServiceMock, config) {
        storyEdit = _storyEdit_;
        $httpBackend = _$httpBackend_;
        story = _story_;
        storyMockData = storyServiceMock.books;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            "editor": {
                "maxStoryCache": 500
            }
        });
        $httpBackend.expectGET('/books').respond(200, storyMockData);
        config.load();
        story.list();
        $httpBackend.flush();
    }));

    it('should provide a story', function () {
        expect(storyEdit.getStory(56421532).title).to.equal(story.findStoryById(56421532).title);
    });

    it('should not change the storyService object', function () {
        var storyObject = storyEdit.getStory(56421532);
        storyObject.title = 'foobar';
        var originalStoryObject = story.findStoryById(56421532);
        expect(originalStoryObject.title).to.equal('Cancelled orders');
        expect(storyEdit.getStory(56421532).title).to.equal('foobar');
    });

    it('should mark an object as dirty if changed', function () {
        expect(storyEdit.isDirty(56421532)).to.be.false();
        var storyObject = storyEdit.getStory(56421532);
        storyObject.title = 'foobar';
        expect(storyEdit.isDirty(56421532)).to.be.true();
    });

    it('should be able to cancel changes', function () {
        var storyObject = storyEdit.getStory(56421532);
        storyObject.title = 'foobar';
        expect(storyObject.title).to.equal('foobar');
        storyEdit.cancel(56421532);
        expect(storyObject.title).to.equal('Cancelled orders');
    });

    it('should be able to apply changes', function () {
        var storyObject = storyEdit.getStory(56421532);
        storyObject.title = 'foobar';
        storyEdit.apply(56421532);
        var originalStoryObject = story.findStoryById(56421532);
        expect(originalStoryObject.title).to.equal('foobar');
    });


});
