module.exports = pubsub;
module.exports.on = on;

function pubsub(customProxy){
  var proxy = customProxy || function pubsubProxy(){
    arguments.length && sub.apply(undefined, arguments);
  };

  function sub(callback){
    subscribe(proxy, callback);
  }

  function unsub(callback){
    unsubscribe(proxy, callback);
  }

  function pub(){
    var args = [proxy];
    Array.prototype.push.apply(args, arguments);
    publish.apply(undefined, args);
  }

  proxy.subscribers      = [];
  proxy.subscribe        = sub;
  proxy.unsubscribe      = unsub;
  proxy.publish          = pub;
  proxy.extendsAdaPubsub = true;
  proxy.hasCustomProxy   = !!customProxy;

  return proxy;
}

/**
 * Publish "from" by applying given args
 *
 * @param {Object, Function} options, from
 * @param {...Any} args
 */
function publish(options){
  var from;

  if(options.from){
    from = options.from;
  } else {
    from = options;
    options = {};
  }

  if (from && from.subscribers && from.subscribers.length == 0) {
    return;
  }

  var args = Array.prototype.slice.call(arguments, 1);

  from.subscribers.forEach(function(cb, i){
    if(!cb) return;

    try {
      cb.callback.apply(undefined, args);
    } catch(exc) {
      setTimeout(function(){ throw exc; }, 0);
    }
  });
}

/**
 * Subscribe callback to given pubsub object.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function subscribe(to, callback){
  if(!callback) throw new Error('Invalid callback: '+ callback);
  to.subscribers.push(typeof callback == 'function' ? { callback: callback } : callback);
}

/**
 * Unsubscribe callback to given pubsub object.
 *
 * @param {Pubsub} to
 * @param {Function} callback
 */
function unsubscribe(to, callback){
  var i = to.subscribers.length;

  while(i--){
    if(to.subscribers[i] && to.subscribers[i].callback == callback){
      to.subscribers[i] = null;

      return i;
    }
  }

  return false;
}

function on(/* pubsubs..., callback */){
  var callback      = arguments[arguments.length - 1],
      subscriptions = [],
      fired         = [],
      timer;

  function newSubscriber(pubsub){
    return function(){
      var args  = arguments;

      fired.push({ pubsub: pubsub, params: args });

      if(timer){
        clearTimeout(timer);
        timer = undefined;
      }

      timer = setTimeout(function(){
        callback(fired);
        fired = [];
      }, 0);
    };
  }

  function add(){
    var i = arguments.length,
        cb;

    while( i --> 0 ){
      cb = newSubscriber(arguments[i]);
      arguments[i].subscribe(cb);

      subscriptions.push({
        pubsub: arguments[i],
        callback: cb
      });
    }
  }

  function rm(pubsub){
    var i = subscriptions.length,
        removed = false;

    while( i --> 0 ){
      if(subscriptions[i] && subscriptions[i].pubsub == pubsub){
        pubsub.unsubscribe(subscriptions[i].callback);
        subscriptions[i] = undefined;
      }
    }
  }

  add.apply(undefined, Array.prototype.slice.call(arguments, 0, arguments.length - 1));

  return {
    subscribeTo: add,
    unsubscribeTo: rm
  };
}
