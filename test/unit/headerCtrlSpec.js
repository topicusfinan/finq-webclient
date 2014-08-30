//
// test/unit/controllers/app.js
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
            searchTimeout: 200
        });
        $httpBackend.expectGET('/app/info').respond(200, {
            subject: 'Test'
        });
    }));

    it('should initialize an empty search query', function () {
        configProvider.load().then(function() {
            HeaderCtrl = $controller('HeaderCtrl', {$scope: scope});
            expect(HeaderCtrl.query).toBe('');
            done();
        });
    });

    it('should set an initial title for the page', function () {
        configProvider.load().then(function() {
            HeaderCtrl = $controller('HeaderCtrl', {$scope: scope});
            expect(HeaderCtrl.title).toBe('Test');
            done();
        });
    });

    it('should define a search timeout', function () {
        configProvider.load().then(function() {
            HeaderCtrl = $controller('HeaderCtrl', {$scope: scope});
            expect(HeaderCtrl.timeout).toBe(200);
            done();
        });
    });

    it('should initially have its loaded indication not set to true', function () {
        configProvider.load().then(function() {
            HeaderCtrl = $controller('HeaderCtrl', {$scope: scope});
            expect(HeaderCtrl.loaded).not.toBe(true);
            done();
        });
    });

});
