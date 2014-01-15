var pubsub = require('./');

describe('pubsub()', function(){
  it('returns an empty pubsub by default', function(){
    var foo = pubsub();
    expect(foo.subscribe).to.exist;
    expect(foo.unsubscribe).to.exist;
  });

  it('mixes given object with pubsub API', function(){
    var foo = pubsub({ value: 123, hello: 'world' });
    expect(foo.subscribe).to.exist;
    expect(foo.unsubscribe).to.exist;
  });

});

describe('subscribe', function(){

  it('adds callback for updates', function(done){
    var foo = pubsub();
    foo.subscribe(done);
    foo.publish();
  });

  it('allows unsubscription', function(done){
    var foo = pubsub();
    foo.subscribe(fail);
    foo.unsubscribe(fail);
    foo.subscribe(done);

    foo.publish();

    function fail () {
      done(new Error('Failed'));
    }
  });

  it('can add multiple callbacks', function(done){
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
      expect(acc).to.equal(16);
      done();
    });

    foo.publish();

  });

});

describe('publish', function(){

  it('passes given parameters to callbacks', function(done){
    var foo = pubsub();

    foo.subscribe(function (a, b, c) {
      expect(a).to.equal(3);
      expect(b).to.equal(1);
      expect(c).to.equal(4);
      done();
    });

    foo.publish(3, 1, 4);
  });

  it('notifies callbacks each time', function(done){
    var foo = pubsub();

    var sum = 0;
    foo.subscribe(function () {
      sum += Array.prototype.reduce.call(arguments, function (a, b) {
        return a + b;
      });

      if (sum == 28) done();
    });

    foo.publish(1, 2);
    foo.publish(3, 4, 5, 6);
    foo.publish(7);
  });

  it("doesn't publish to unsubscribed callbacks", function(done){
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
      expect(acc).to.equal(36);
      done();
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

  it("doesn't break when a callback produces error", function(done){
    var foo = pubsub();

    var errCounter = 0;

    process.on('uncaughtException', function (err) {
      if (err.message != 'Just Ignore ' + ++errCounter) return;
      expect(acc).to.equal(5);
      if (errCounter == 2) done();
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
  });

});

describe('once', function(){

  it('allows one-time subscription', function(done){
    var foo = pubsub();
    var firstTime = true;

    foo.subscribe.once(function () {
      expect(firstTime).to.be.true;
      firstTime = false;
      done();
    });

    foo.publish();
    foo.publish();
    foo.publish();
  });

  it('allows unsubscribing, too', function(done){
    var foo = pubsub();
    foo.subscribe.once(fail);
    foo.unsubscribe.once(fail);
    foo.subscribe.once(done);

    foo.publish();
    foo.publish();
    foo.publish();

    function fail () {
      console.log('fail');
      done(new Error('Failed'));
    }
  });

  it('allows multiple one-time subscription to updates', function(done){
    var foo = pubsub();

    var once = true;
    var acc = 0;
    var publishCounter = 0;

    foo.subscribe.once(function () {
      expect(once).to.be.true;
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
      expect(once).to.be.true;
      once = false;
      acc += 6;
    });

    foo.subscribe.once(function () {
      acc *= 7;
    });

    foo.subscribe.once(function () {
      expect(acc).to.equal(56);
      expect(publishCounter).to.equal(4);
      done();
    });

    foo.publish();
    foo.publish();
    foo.publish();

    function screw () {
      acc = 0;
    }

  });

});
