/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: Story Set Filter execution', function() {

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
    beforeEach(inject(function (runningServiceMock) {
        runs = runningServiceMock.runs;
    }));

    it('should keep all runs in case of a clear filter', function () {
        var filteredRuns = runEnvironmentFilter(runs,[]);
        expect(filteredRuns.length).to.equal(1);
    });

    it('should filter runs in case they do not match the filter', function () {
        var filteredRuns = runEnvironmentFilter(runs,[2]);
        expect(filteredRuns.length).to.equal(0);
    });

    it('should filter runs in case they match the filter', function () {
        var filteredRuns = runEnvironmentFilter(runs,[1]);
        expect(filteredRuns.length).to.equal(1);
    });

});
