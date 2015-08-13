/**
 * Created by c.kramer on 9/2/2014.
 */
'use strict';

describe('Unit: TranslateService initialization', function() {

    var translateService,
        translations;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($httpBackend, $translation) {
        translateService = $translation;
        $httpBackend.expectGET('/lang/en.json').respond(200, {LANG : 'US English'});
        translateService.load('en').then(function(translateData) {
            translations = translateData;
        });
        $httpBackend.flush();
    }));

    it('should properly load the translation file', function () {
        expect(translations).to.not.be.undefined;
        expect(translations.LANG).to.equal('US English');
    });

});
