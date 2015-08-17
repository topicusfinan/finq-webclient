/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: ValueService base values', function() {

    var valueService;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($value) {
        valueService = $value;
    }));

    it('should properly load all initial values', function () {
        expect(valueService.hasMorePages).to.not.be.undefined();
    });

});
