var pubsub = require('./');

it('subscribes and publishes', function(done){
  var foo = pubsub();

  foo.subscribe(function () { done(); });

  foo.publish(3, 1, 4);
});

it('adds multiple subscriptions', function(done){
  var foo = pubsub();

  foo.subscribe(function () {});
  foo.subscribe(function () {});
  foo.subscribe(function () { done(); });

  foo.publish(3, 1, 4);
});

it('subscribes and unsubscribes', function(){
  var foo = pubsub();
  foo.subscribe(foo);
  foo.unsubscribe(foo);

  function foo () {}
});
