var should = require('chai').should(),
    pubsub  = require('./');

it('publishes', function(done){

  var foo = pubsub();

  var i = 0;
  foo.subscribe(function(a, b){
    a.should.be.equal(3);
    b.should.be.equal(4);
    i++;
  });

  foo.subscribe(function(a, b){
    a.should.be.equal(3);
    b.should.be.equal(4);
    i++;
  });

  foo.subscribe(function(a, b){
    a.should.be.equal(3);
    b.should.be.equal(4);
    i.should.be.equal(2);
    done();
  });

  foo.publish(3, 4);

});

it('has subscription', function(done){

  function cb1(){}
  function cb2(){}
  function cb3(){}

  var foo = pubsub();

  foo.subscribe(cb1);
  foo.subscribe(cb2);
  foo.subscribe(cb3);

  foo.subscribers.length.should.be.equal(3);
  foo.subscribers[0].callback.should.be.equal(cb1);
  foo.subscribers[1].callback.should.be.equal(cb2);
  foo.subscribers[2].callback.should.be.equal(cb3);

  done();

});

it('has unsubscription', function(done){
  function cb1(){}
  function cb2(){}
  function cb3(){}

  var foo = pubsub();

  foo.subscribe(cb1);
  foo.subscribe(cb2);
  foo.subscribe(cb3);

  foo.unsubscribe(cb2);

  foo.subscribers.length.should.be.equal(3);
  foo.subscribers[0].callback.should.be.equal(cb1);
  should.not.exist(foo.subscribers[1]);
  foo.subscribers[2].callback.should.be.equal(cb3);

  done();
});
