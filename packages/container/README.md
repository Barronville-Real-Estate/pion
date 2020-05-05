# Package: `@pion-toolkit/container`

> An easy-to-use __IoC__ (*inversion of control*) container.

## Installation

To install __`@pion-toolkit/container`__, run:

```sh
npm i --save '@pion-toolkit/container'
```

## Usage

```typescript
import assert from 'assert'
import Container from '@pion-toolkit/container'

const container = new Container()

class Bar {
  constructor(foo) {
    this.foo = foo
  }
}

class FooA {}
class FooB {}

const barKey = Symbol.for('bar')
const fooKey = Symbol.for('foo')

container.bindClass(fooKey, FooA)

container.bindClass(barKey, Bar, { foo: fooKey })
container.contextuallyBindClass(barKey, fooKey, FooB)

const foo = container.resolve(fooKey)
const bar = container.resolve(barKey)

assert(foo instanceof FooA)
assert(bar.foo instanceof FooB)
```

### API

Check out the [*API documentation*](docs/classes/_container_.container.md).

## Author

__Jonathan Barronville__ <[jonathan@re.bville.cc](mailto:jonathan@re.bville.cc)>

## License

__`Apache-2.0`__, *Apache License, Version 2.0*
