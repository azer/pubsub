var test = require('prova');
var pubsub = require('./');

test('pubsub() returns an empty pubsub by default', function(t){
  t.plan(2);
  var foo = pubsub();
  t.ok(foo.subscribe);
  t.ok(foo.unsubscribe);
});

test('pubsub() mixes given object with pubsub API', function(t){
  t.plan(2);
  var foo = pubsub({ value: 123, hello: 'world' });
  t.ok(foo.subscribe);
  t.ok(foo.unsubscribe);
});

test('subscribe() adds callback for updates', function (t) {
  var foo = pubsub();
  foo.subscribe(t.end);
  foo.publish();
});

test('subscribe() allows unsubscription', function (t) {
  var foo = pubsub();
  foo.subscribe(fail);
  foo.unsubscribe(fail);
  foo.subscribe(t.end);

  foo.publish();

  function fail () {
    t.error(new Error('Failed'));
  }
});

test('subscribe() can add multiple callbacks', function (t) {
  var foo = pubsub();

  var acc = 0;

  foo.subscribe(function () {
    acc += 1;
  });

  foo.subscribe(function () {
    acc *= 20;
  });

  foo.subscribe(function () {
    acc--;
  });

  foo.subscribe(function () {
    acc /= 19;
  });

  foo.subscribe(function () {
    acc += 3;
  });

  foo.subscribe(function () {
    acc *= 4;
  });

  foo.subscribe(function () {
    t.equal(acc, 16);
    t.end();
  });

  foo.publish();

});

test('publish() passes given parameters to callbacks', function (t) {
  var foo = pubsub();

  foo.subscribe(function (a, b, c) {
    t.equal(a, 3);
    t.equal(b, 1);
    t.equal(c, 4);
    t.end();
  });

  foo.publish(3, 1, 4);
});

test('publish() notifies callbacks each time', function (t) {
  var foo = pubsub();

  var sum = 0;
  foo.subscribe(function () {
    sum += Array.prototype.reduce.call(arguments, function (a, b) {
      return a + b;
    });

    if (sum == 28) t.end();
  });

  foo.publish(1, 2);
  foo.publish(3, 4, 5, 6);
  foo.publish(7);
});

test("publish() doesn't publish to unsubscribed callbacks", function (t) {
  var foo = pubsub();

  var acc = 0;

  foo.subscribe(step1);
  foo.subscribe(step2);
  foo.subscribe(step3);
  foo.subscribe(step4);
  foo.subscribe(step5);
  foo.subscribe(step6);
  foo.subscribe(step7);
  foo.subscribe(step8);

  foo.unsubscribe(step3);
  foo.unsubscribe(step4);
  foo.unsubscribe(step5);
  foo.unsubscribe(step7);

  foo.subscribe(step5);

  foo.subscribe(function () {
    t.equal(acc, 36);
    t.end();
  });

  foo.publish();

  function step1 () {
    acc += 2;
  }

  function step2 () {
    acc *= 2;
  }

  function step3 () {
    acc -= 3;
  }

  function step4 () {
    acc *= 10;
  }

  function step5 () {
    acc /= 2;
  }

  function step6 () {
    acc += 20;
  }

  function step7 () {
    acc *= 6;
  }

  function step8 () {
    acc *= 3;
  }

});

/*test("publish() doesn't break when a callback produces error", function (t) {
  var foo = pubsub();

  var errCounter = 0;

  process.on('uncaughtException', function (err) {
    if (err.message != 'Just Ignore ' + ++errCounter) return;
    t.equal(acc, 5);
    if (errCounter == 2) t.end();
  });

  foo.subscribe(function () {
    throw new Error('Just Ignore 1');
  });

  var acc = 0;

  foo.subscribe(function () {
    throw new Error('Just Ignore 2');
  });

  foo.subscribe(function () {
    acc++;
  });

  foo.subscribe(function () {
    acc *= 5;
  });

  foo.publish();
});*/

test('allows one-time subscription', function (t) {
  var foo = pubsub();
  var firstTime = true;

  foo.subscribe.once(function () {
    t.ok(firstTime);
    firstTime = false;
    t.end();
  });

  foo.publish();
  foo.publish();
  foo.publish();
});

test('allows unsubscribing, too', function (t) {
  var foo = pubsub();
  foo.subscribe.once(fail);
  foo.unsubscribe.once(fail);
  foo.subscribe.once(t.end);

  foo.publish();
  foo.publish();
  foo.publish();

  function fail () {
    console.log('fail');
    t.error(new Error('Failed'));
  }
});

test('allows multiple one-time subscription to updates', function (t) {
  var foo = pubsub();

  var once = true;
  var acc = 0;
  var publishCounter = 0;

  foo.subscribe.once(function () {
    t.ok(once);
    once = false;
    acc += 2;
  });

  foo.subscribe.once(function () {
    acc *= 10;
  });

  foo.subscribe.once(function () {
    acc--;
  });

  foo.subscribe.once(screw);

  foo.subscribe.once(function () {
    acc--;
    acc /= 9;
  });

  foo.subscribe(function () {
    publishCounter++;
  });

  foo.unsubscribe.once(screw);
  foo.subscribe.once(screw);
  foo.unsubscribe.once(screw);

  foo.publish();
  foo.publish();
  foo.publish();

  once = true;

  foo.subscribe.once(function () {
    t.ok(once);
    once = false;
    acc += 6;
  });

  foo.subscribe.once(function () {
    acc *= 7;
  });

  foo.subscribe.once(function () {
    t.equal(acc, 56);
    t.equal(publishCounter, 4);
    t.end();
  });

  foo.publish();
  foo.publish();
  foo.publish();

  function screw () {
    acc = 0;
  }

});
