/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: EnvironmentService', function() {

    var environmentService,
        environmentMockData,
        environments;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
        module('finqApp.mock');
    });
    beforeEach(inject(function ($httpBackend, environment, environmentServiceMock) {
        environmentService = environment;
        environmentMockData = environmentServiceMock.environments;
        $httpBackend.expectGET('/environment/list').respond(200, environmentMockData);
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

    it('should be able to retrieve an environment value by its key reference', function () {
        var value = environmentService.getValueByKey(environments[0].key);
        expect(value).to.equal(environments[0].value);
    });

    it('should return null when retrieving an environment value by its key reference when the environment could not be found', function () {
        var value = environmentService.getValueByKey('xyz');
        expect(value).to.be.null;
    });

});
