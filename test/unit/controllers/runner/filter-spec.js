/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: AvailableCtrlFilter initialization', function() {

    var AvailableFilterCtrl,
        scope,
        sets,
        tags;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, config, setServiceMock, tagServiceMock) {
        scope = $rootScope.$new();
        sets = setServiceMock.sets;
        tags = tagServiceMock.tags;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            address: '',
            pagination : {
                maxScenarios : 2
            }
        });
        $httpBackend.expectGET('/app').respond(200);
        $httpBackend.expectGET('/sets').respond(200, sets);
        $httpBackend.expectGET('/tags').respond(200, tags);
        config.load().then(function() {
            AvailableFilterCtrl = $controller('AvailableFilterCtrl', {$scope: scope});
        });
        $httpBackend.flush();
    }));

    it('should load a list of sets to populate the set filter', function () {
        expect(AvailableFilterCtrl.sets).to.deep.equal(sets);
    });

    it('should load a list of tags to populate the tag filter', function () {
        expect(AvailableFilterCtrl.tags).to.deep.equal(tags);
    });

    it('should set the filter to fully loaded', function () {
        expect(AvailableFilterCtrl.loaded).to.be.true;
    });

});
