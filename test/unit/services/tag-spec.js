/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: TagService initialization', function() {

    var tagService,
        tagMockData,
        $rootScope,
        tags;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, tag, tagServiceMock, _$rootScope_) {
        tagService = tag;
        $rootScope = _$rootScope_;
        tagMockData = tagServiceMock.tags;
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

    it('should retrieve a loaded tag list in case the listing function is called again', function (done) {
        tagService.list().then(function(list) {
            expect(list).to.deep.equal(tags);
            done();
        });
        $rootScope.$digest();
    });

});

describe('Unit: TagService initialization with an unstable backend', function() {

    var tagService,
        feedback;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($httpBackend, tag) {
        tagService = tag;
        $httpBackend.expectGET('/tag/list').respond(503);
        tagService.list().then(null,function(error) {
            feedback = error;
        });
        $httpBackend.flush();
    }));

    it('should fail to load the tags', function () {
        expect(feedback).to.not.be.undefined;
    });

});
