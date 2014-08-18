'use strict';

describe('Controller: AppcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('finqApp'));

  var AppcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AppcontrollerCtrl = $controller('AppcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
