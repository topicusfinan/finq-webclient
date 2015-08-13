/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: SetService initialization', function() {

    var setService,
        setMockData,
        $rootScope,
        sets;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, $set, setServiceMock, _$rootScope_) {
        setService = $set;
        $rootScope = _$rootScope_;
        setMockData = setServiceMock.sets;
        $httpBackend.expectGET('/sets').respond(200, setMockData);
        setService.list().then(function(setData) {
            sets = setData;
        });
        $httpBackend.flush();
    }));

    it('should properly load the set list', function () {
        expect(sets).to.not.be.null;
        expect(sets).to.not.be.empty;
        expect(sets[0]).to.deep.equal(setMockData[0]);
    });

    it('should retrieve a loaded set list in case the listing function is called again', function (done) {
        setService.list().then(function(list) {
            expect(list).to.deep.equal(sets);
            done();
        });
        $rootScope.$digest();
    });

});

describe('Unit: SetService initialization with an unstable backend', function() {

    var setService,
        feedback;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($httpBackend, $set) {
        setService = $set;
        $httpBackend.expectGET('/sets').respond(503);
        setService.list().then(null,function(error) {
            feedback = error;
        });
        $httpBackend.flush();
    }));

    it('should fail to load the sets', function () {
        expect(feedback).to.not.be.undefined;
    });

});
