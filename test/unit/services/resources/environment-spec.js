/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: EnvironmentService', function() {

    var environmentService,
        environmentMockData,
        $rootScope,
        environments;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, environment, environmentServiceMock, _$rootScope_) {
        environmentService = environment;
        environmentMockData = environmentServiceMock.environments;
        $rootScope = _$rootScope_;
        $httpBackend.expectGET('/environments').respond(200, environmentMockData);
        environmentService.list().then(function(envData) {
            environments = envData;
        });
        $httpBackend.flush();
    }));

    it('should properly load the environment list', function () {
        expect(environments).to.not.be.undefined;
        expect(environments).to.not.be.empty;
        expect(environments[0]).to.deep.equal(environmentMockData[0]);
    });

    it('should be able to retrieve an environment name by its id reference', function () {
        var environment = environmentService.getById(environments[0].id);
        expect(environment).to.deep.equal(environments[0]);
    });

    it('should return null when retrieving an environment value by its key reference when the environment could not be found', function () {
        var environment = environmentService.getById('xyz');
        expect(environment).to.be.null;
    });

    it('should retrieve a loaded enviroment list in case the listing function is called again', function (done) {
        environmentService.list().then(function(list) {
            expect(list).to.deep.equal(environments);
            done();
        });
        $rootScope.$digest();
    });

});
