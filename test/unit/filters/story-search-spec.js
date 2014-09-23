/**
 * Created by c.kramer on 9/6/2014.
 */
'use strict';

describe('Unit: Story Search Filter execution', function() {

    var storySearchFilter,
        storybooks;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.filter');
        module('finqApp.mock');
        inject(function($injector){
            storySearchFilter = $injector.get('$filter')('storySearchFilter');
        });
    });
    beforeEach(inject(function (storyServiceMock,$httpBackend,config,storybookSearch) {
        storybooks = storyServiceMock.books;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            maxSearchResults: 1000
        });
        $httpBackend.expectGET('/app/info').respond(200);
        config.load().then(function() {
            storybookSearch.initialize(storybooks);
        });
        $httpBackend.flush();
    }));

    it('should keep all stories listed in case of an empty search', function () {
        var filteredStories = storySearchFilter(storybooks[0].stories,'',storybooks[0].id);
        expect(filteredStories.length).to.equal(2);
    });

    it('should eliminate stories that do not have a title that matches the query', function () {
        var filteredStories = storySearchFilter(storybooks[0].stories,'writes a new story',storybooks[0].id);
        expect(filteredStories.length).to.equal(0);
    });

    it('should keep stories that have a title that matches the query', function () {
        var filteredStories = storySearchFilter(storybooks[1].stories,'writes a new story',storybooks[1].id);
        expect(filteredStories.length).to.equal(1);
    });

});
