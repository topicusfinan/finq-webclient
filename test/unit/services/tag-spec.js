/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: TagService initialization', function() {

    var tagService,
        tagMockData,
        tags;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, tag, tagServiceMock, host) {
        tagService = tag;
        tagMockData = tagServiceMock.tags;
        host.setHost({address: ''});
        $httpBackend.expectGET('/tag/list').respond(200, tagMockData);
        tagService.list().then(function(tagData) {
            tags = tagData;
        });
        $httpBackend.flush();
    }));

    it('should properly load the tag list', function () {
        expect(tags).to.not.be.undefined;
        expect(tags).to.not.be.empty;
        expect(tags[0]).to.deep.equal(tagMockData[0]);
    });

});
