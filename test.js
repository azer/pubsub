var pubsub = require('./'),
    expect = require('chai').expect;

it('publishes', function(done){

  var foo = pubsub();

  var i = 0;
  foo.subscribe(function(a, b){
    expect(a).to.equal(3);
    expect(b).to.equal(4);

    i++;
  });

  foo.subscribe(function(a, b){
    expect(a).to.equal(3);
    expect(b).to.equal(4);
    i++;
  });

  foo.subscribe(function(a, b){
    expect(a).to.equal(3);
    expect(b).to.equal(4);
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

  expect(foo.subscribers.length).to.equal(3);
  expect(foo.subscribers[0]).to.equal(cb1);
  expect(foo.subscribers[1]).to.equal(cb2);
  expect(foo.subscribers[2]).to.equal(cb3);

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

  expect(foo.subscribers.length).to.equal(3);

  expect(foo.subscribers[0]).to.equal(cb1);
  expect(foo.subscribers[1]).to.not.exist;
  expect(foo.subscribers[2]).to.equal(cb3);

  done();
});

it('lets subscribe for once', function(done){
  var p = pubsub();
  p.subscribe.once(first);
  p.subscribe.once(third);
  p.unsubscribe.once(third);

  setTimeout(function(){
    p.publish();

    p.subscribe.once(second);
    p.subscribe.once(forth);
    p.publish();

  }, 100);

  function first (){
    expect(first.called).to.not.exist;
    first.called = true;
  }

  function second () {
    second.called = true;
  }

  function third () {
    done(new Error('Third callback shouldnt have been called'));
  }

  function forth () {
    expect(second.called).to.be.true;
    done();
  }

});
