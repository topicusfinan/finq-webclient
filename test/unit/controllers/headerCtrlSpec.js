//
// test/unit/controllers/layout/header.js
//
describe("Unit: HeaderCtrl initialization", function() {

    var HeaderCtrl,
        configProvider,
        scope;

    beforeEach(function() {
        module('finqApp');
        module('finqApp.service');
    });
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, config) {
        scope = $rootScope.$new();
        configProvider = config;
        $httpBackend.expectGET('/scripts/config.json').respond(200, {
            searchTimeout: 200,
            address: ''
        });
        $httpBackend.expectGET('/app/info').respond(200, {
            subject: 'Test'
        });
        configProvider.load().then(function() {
            HeaderCtrl = $controller('HeaderCtrl', {$scope: scope});
        });
        $httpBackend.flush();
    }));

    it('should initialize set its variables properly', function () {
        expect(HeaderCtrl.query).to.equal('');
        expect(HeaderCtrl.timeout).to.equal(200);
        expect(HeaderCtrl.loaded).not.to.be.true;
        expect(HeaderCtrl.title).to.equal('Test');
    });

});
