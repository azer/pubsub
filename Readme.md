Minimalist Pubsub Library.

```bash
$ npm install ada-pubsub # component install adaio/pubsub
```

## API

### pubsub()

Creates and returns a new Pubsub object.

```js
var onReady = pubsub();

onReady(function(a, b){ // or onReady.subscribe
    console.log('A: %s, B: %s', a, b);
});

onReady.publish(3, 4);
```

### pubsub(customProxy)

```js
pubsub(exports);

function callback(a, b){
    console.log('A: %s, B: %s', a, b);
}

exports.subscribe(callback);
exports.subscribers.length
// => 1

exports.unsubscribe(callback);
exports.subscribers.length
// => 0
```

### .on([, pubsub], callback)
Calls the callback when any of given pubsub instances is emitted.

```js
var a = pubsub(),
    b = pubsub(),
    c = pubsub();

pubsub.on(a, b, c, function(updates){
    updates[0].pubsub;
    // => a
    updates[0].params;
    // => 3, 4

    updates[1].pubsub;
    // => c
    updates[1].params;
    // => 5, 6
});

a.publish(3, 4);
c.publish(5, 6);
```

## License

  MIT
