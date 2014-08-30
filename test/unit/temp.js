describe("a test", function(){
  var foo = false;

  beforeEach(function(done){

    setTimeout(function(){
      foo = true;

      // complete the async beforeEach
      done();

    }, 50);

  });

  it("should pass", function(){
    expect(foo).equals(true);
  });

});
