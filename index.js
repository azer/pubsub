module.exports = pubsub;

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
