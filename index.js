module.exports = pubsub;

function pubsub (mix) {
  var subscribers;
  var subscribersForOnce;

  mix || (mix = function (fn) {
    if (fn) mix.subscribe(fn);
  });

  mix.subscribe = function (fn) {
    if (!subscribers) return subscribers = fn;
    if (typeof subscribers == 'function') subscribers = [subscribers];
    subscribers.push(fn);
  };

  mix.subscribe.once = function (fn) {
    if (!subscribersForOnce) return subscribersForOnce = fn;
    if (typeof subscribersForOnce == 'function') subscribersForOnce = [subscribersForOnce];
    subscribersForOnce.push(fn);
  };

  mix.unsubscribe = function (fn) {
    if (!subscribers) return;

    if (typeof subscribers == 'function') {
      if (subscribers != fn) return;
      subscribers = undefined;
      return;
    }

    var i = subscribers.length;

    while (i--) {
      if (subscribers[i] && subscribers[i] == fn){
        subscribers[i] = undefined;
        return;
      }
    }
  };

  mix.unsubscribe.once = function (fn) {
    if (!subscribersForOnce) return;

    if (typeof subscribersForOnce == 'function') {
      if (subscribersForOnce != fn) return;
      subscribersForOnce = undefined;
      return;
    }

    var i = subscribersForOnce.length;

    while (i--) {
      if (subscribersForOnce[i] && subscribersForOnce[i] == fn){
        subscribersForOnce[i] = undefined;
        return;
      }
    }
  };

  mix.publish = function () {
    var params = arguments;
    var i, len;

    if (subscribers && typeof subscribers != 'function' && subscribers.length) {
      i = -1;
      len = subscribers.length;

      while (++i < len) {
        if (!subscribers[i] || typeof subscribers[i] != 'function') continue;

        try {
          subscribers[i].apply(undefined, params);
        } catch(err) {
          setTimeout(function () { throw err; }, 0);
        }
      };
    } else if (typeof subscribers == 'function') {
      try {
        subscribers.apply(undefined, params);
      } catch(err) {
        setTimeout(function () { throw err; }, 0);
      }
    }

    if (subscribersForOnce && typeof subscribersForOnce != 'function' && subscribersForOnce.length) {
      i = -1;
      len = subscribersForOnce.length;

      while (++i < len) {
        if (!subscribersForOnce[i] || typeof subscribersForOnce[i] != 'function') continue;

        try {
          subscribersForOnce[i].apply(undefined, params);
        } catch(err) {
          setTimeout(function () { throw err; }, 0);
        }
      };

      subscribersForOnce = undefined;
    } else if (typeof subscribersForOnce == 'function') {
      try {
        subscribersForOnce.apply(undefined, params);
      } catch(err) {
        setTimeout(function () { throw err; }, 0);
      }
      subscribersForOnce = undefined;
    }
  };

  return mix;
}
