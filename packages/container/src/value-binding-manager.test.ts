// *****************************************************************************
// * Copyright 2020-present Jonathan Barronville <jonathan@re.bville.cc>       *
// *                                                                           *
// * Licensed under the Apache License, Version 2.0 (the "License");           *
// * you may not use this file except in compliance with the License.          *
// * You may obtain a copy of the License at                                   *
// *                                                                           *
// *     http://www.apache.org/licenses/LICENSE-2.0                            *
// *                                                                           *
// * Unless required by applicable law or agreed to in writing, software       *
// * distributed under the License is distributed on an "AS IS" BASIS,         *
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
// * See the License for the specific language governing permissions and       *
// * limitations under the License.                                            *
// *****************************************************************************

import type { IClassBindingEntryClassType as ClassType } from './class-binding-entry.i'
import type IValueBindingManager from './value-binding-manager.i'
import type IValueBindingManagerConstructor from './value-binding-manager-constructor.i'
import type { IValueBindingManagerValueType as ValueType } from './value-binding-manager.i'

type IValueBindingManagerPrivateType = (IValueBindingManager &
                                        { _bindings: Map<symbol, ValueType> });

const $p = (bindings: IValueBindingManager) => (bindings as IValueBindingManagerPrivateType)

describe('ValueBindingManager', () => {
  let ValueBindingManager: ClassType<IValueBindingManagerConstructor>



  beforeEach(async () => {
    ValueBindingManager = ((module) => module.default)(await import('./value-binding-manager'))
  })



  test('#constructor() :: properly constructs a new instance', () => {
    const valueBindings = new ValueBindingManager()
    const valueBindingsPrivate = $p(valueBindings)
    expect(valueBindings).toBeInstanceOf(ValueBindingManager)
    expect(valueBindingsPrivate._bindings).toBeInstanceOf(Map)
    expect(valueBindingsPrivate._bindings).toBeEmpty()
  })



  test('#clear() :: clears the instance', () => {
    const valueBindings = new ValueBindingManager()
    const valueBindingsPrivate = $p(valueBindings)
    expect(valueBindingsPrivate._bindings).toBeEmpty()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    valueBindings.set(fooSymbol, foo)
    expect(valueBindingsPrivate._bindings.size).toStrictEqual(1)
    valueBindings.clear()
    expect(valueBindingsPrivate._bindings).toBeEmpty()
  })



  test('#contains() :: checks if an entry exists for a key', () => {
    const valueBindings = new ValueBindingManager()
    const fooSymbol = Symbol('foo')
    expect(valueBindings.contains(fooSymbol)).toBeFalse()
    const Foo = (class Foo
    {})
    const foo = new Foo()
    valueBindings.set(fooSymbol, foo)
    expect(valueBindings.contains(fooSymbol)).toBeTrue()
    valueBindings.unset(fooSymbol)
    expect(valueBindings.contains(fooSymbol)).toBeFalse()
  })



  test('#get() :: gets the value for a key', () => {
    const valueBindings = new ValueBindingManager()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    valueBindings.set(fooSymbol, foo)
    expect(valueBindings.get(fooSymbol)).toBe(foo)
  })

  test('#get() :: gets the value for a key :: when no entry exists, returns {undefined}', () => {
    const valueBindings = new ValueBindingManager()
    const fooSymbol = Symbol('foo')
    expect(valueBindings.get(fooSymbol)).toBeUndefined()
  })



  test('#set() :: sets a key and value entry', () => {
    const valueBindings = new ValueBindingManager()
    const fooSymbol = Symbol('foo')
    expect(valueBindings.contains(fooSymbol)).toBeFalse()
    const Foo = (class Foo
    {})
    const foo = new Foo()
    valueBindings.set(fooSymbol, foo)
    expect(valueBindings.contains(fooSymbol)).toBeTrue()
  })



  test('#unset() :: unsets a key and value entry', () => {
    const valueBindings = new ValueBindingManager()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const foo = new Foo()
    valueBindings.set(fooSymbol, foo)
    expect(valueBindings.contains(fooSymbol)).toBeTrue()
    valueBindings.unset(fooSymbol)
    expect(valueBindings.contains(fooSymbol)).toBeFalse()
  })
})
