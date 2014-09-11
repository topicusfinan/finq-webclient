/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: SetService initialization', function() {

    var setService,
        setMockData,
        sets;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, set, setServiceMock) {
        setService = set;
        setMockData = setServiceMock.sets;
        $httpBackend.expectGET('/set/list').respond(200, setMockData);
        setService.list().then(function(setData) {
            sets = setData;
        });
        $httpBackend.flush();
    }));

    it('should properly load the set list', function () {
        expect(sets).to.not.be.undefined;
        expect(sets).to.not.be.empty;
        expect(sets[0]).to.deep.equal(setMockData[0]);
    });

});
