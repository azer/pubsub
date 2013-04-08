Minimalist Pubsub Library.

```bash
$ npm install new-pubsub
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



## License

  MIT
