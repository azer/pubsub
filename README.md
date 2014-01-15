# pubsub [![Build Status](https://travis-ci.org/azer/pubsub.png)](https://travis-ci.org/azer/pubsub)

Library for creating individual events with a minimalistic API.

## Install

```bash
$ npm install pubsub
```

## Usage

```js
onReady = pubsub()

onReady(function(a, b, c){ // shortcut to: onReady.subscribe
    console.log(a, b, c)
    // => 3, 4, 1
})

onReady.publish(3, 4, 1)
```

You can optionally, you can pass `pubsub()` an object to mix the interfaces:

```js
foo = pubsub({ value: 12345 })

foo.subscribe(function () {

  foo.value
  // => 3.14
  // => 158
})

foo.value = 314
foo.publish()

foo.value = 158
foo.publish()
```

## API

### subscribe(`fn`)

```js
foo.subscribe(function(update){

    update
    // => 3.14
    // => 156
    // => { last: true }

})

foo.publish(3.14)
foo.publish(156)
foo.publish({ last: true })
```

### subscribe.once(`fn`)

```js
foo.subscribe.once(function(update){

    update
    // => 3.14

})

foo.publish(3.14)
foo.publish(156)

```

### unsubscribe(`fn`)

### unsubscribe.once(`fn`)
