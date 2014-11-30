/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: Run Environment Filter execution', function() {

    var runEnvironmentFilter,
        runs;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.filter');
        module('finqApp.mock');
        inject(function($injector){
            runEnvironmentFilter = $injector.get('$filter')('runEnvironmentFilter');
        });
    });
    beforeEach(inject(function (runServiceMock) {
        runs = runServiceMock.data;
    }));

    it('should keep all runs in case of a clear filter', function () {
        var filteredRuns = runEnvironmentFilter(runs,[]);
        expect(filteredRuns.length).to.equal(2);
    });

    it('should filter runs in case they do not match the filter', function () {
        var filteredRuns = runEnvironmentFilter(runs,[3]);
        expect(filteredRuns.length).to.equal(0);
    });

    it('should filter runs in case they match the filter', function () {
        var filteredRuns = runEnvironmentFilter(runs,[1]);
        expect(filteredRuns.length).to.equal(1);
    });

});
