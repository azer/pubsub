Minimalistic Pubsub Library.

```bash
$ npm install pubsub
```

## Usage

Creates and returns a new Pubsub object.

```js
onReady = pubsub()

onReady(function(a, b){ //  oronReady.subscribe
    console.log('A: %s, B: %s', a, b)
})

onReady.publish(3, 4)
```

### `unsubscribe`

```js
foo = pubsub({ bar: 1 })

function callback(a, b){
    console.log('A: %s, B: %s', a, b)
}

foo.subscribe(callback)
foo.subscribers.length
// => 1

foo.unsubscribe(callback)
foo.subscribers.length
// => 0
```

### `subscribe.once`

```js
foo.subscribe.once(function(update){

    update
    // => 3.14

})

foo.publish(3.14)
foo.publish(156)

```

![](http://distilleryimage9.s3.amazonaws.com/1c773a1e85a011e2bd8822000a9d0df8_6.jpg)
