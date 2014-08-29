//
// test/unit/controllers/app.js
//
describe("Unit: Testing App controller", function() {

    var AppCtrl,
        scope;

    beforeEach(module('finqApp'));
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        AppCtrl = $controller('AppCtrl', {
            $scope: scope
        });
    }));

    it('should set an initial title for the page', function () {
        expect(AppCtrl.title).toBe('Finq');
    });

    it('should define itself as being loaded', function () {
        expect(AppCtrl.loaded).toBe(true);
    });

});
