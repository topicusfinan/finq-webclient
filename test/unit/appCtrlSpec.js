//
// test/unit/controllers/app.js
//
describe("Unit: Testing App controller", function() {

  // load the controller's module
  beforeEach(module('finqApp'));

  var AppCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AppCtrl = $controller('AppCtrl', {
      $scope: scope
    });
  }));

  it('should set an initial title for the page', function () {
    expect(AppCtrl.title).toBe('Finq');
  });

  it('should set template references for the header and menu', function () {
    expect(scope.template.menu).toBe('views/menu.html');
    expect(scope.template.header).toBe('views/header.html');
  });

  it('should define itself as being loaded', function () {
    expect(AppCtrl.loaded).toBe(true);
  });

});
