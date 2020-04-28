// *******************************************************************************
// * Copyright 2020-present Jonathan Barronville <jonathan@re.bville.cc>         *
// *                                                                             *
// * Licensed under the Apache License, Version 2.0 (the "License");             *
// * you may not use this file except in compliance with the License.            *
// * You may obtain a copy of the License at                                     *
// *                                                                             *
// *     http://www.apache.org/licenses/LICENSE-2.0                              *
// *                                                                             *
// * Unless required by applicable law or agreed to in writing, software         *
// * distributed under the License is distributed on an "AS IS" BASIS,           *
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.    *
// * See the License for the specific language governing permissions and         *
// * limitations under the License.                                              *
// *******************************************************************************

import type { IClassBindingEntryClassType as ClassType } from './class-binding-entry.i'
import type IBindingEntry from './binding-entry.i'
import type IClassBindingEntry from './class-binding-entry.i'
import type IClassBindingEntryConstructor from './class-binding-entry-constructor.i'
import type ISimpleBindingManager from './simple-binding-manager.i'
import type ISimpleBindingManagerConstructor from './simple-binding-manager-constructor.i'

type ISimpleBindingManagerPrivateType = (ISimpleBindingManager &
                                         {
                                           _bindings: Map<symbol, IBindingEntry>,
                                           _shouldResolveOnceFlags: Map<symbol, boolean>
                                         });

const $p = (bindings: ISimpleBindingManager) => (bindings as ISimpleBindingManagerPrivateType)

describe('SimpleBindingManager', () => {
  let ClassBindingEntry: ClassType<IClassBindingEntryConstructor>
  let SimpleBindingManager: ClassType<ISimpleBindingManagerConstructor>



  beforeEach(async () => {
    ClassBindingEntry = ((module) => module.default)(await import('./class-binding-entry'))
    SimpleBindingManager = ((module) => module.default)(await import('./simple-binding-manager'))
  })



  test('#constructor() :: properly constructs a new instance', () => {
    const simpleBindings = new SimpleBindingManager()
    const simpleBindingsPrivate = $p(simpleBindings)
    expect(simpleBindings).toBeInstanceOf(SimpleBindingManager)
    expect(simpleBindingsPrivate._bindings).toBeInstanceOf(Map)
    expect(simpleBindingsPrivate._bindings).toBeEmpty()
    expect(simpleBindingsPrivate._shouldResolveOnceFlags).toBeInstanceOf(Map)
    expect(simpleBindingsPrivate._shouldResolveOnceFlags).toBeEmpty()
  })



  test('#clear() :: clears the instance', () => {
    const simpleBindings = new SimpleBindingManager()
    const simpleBindingsPrivate = $p(simpleBindings)
    expect(simpleBindingsPrivate._bindings).toBeEmpty()
    expect(simpleBindingsPrivate._shouldResolveOnceFlags).toBeEmpty()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const fooEntry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    simpleBindings.set(fooSymbol, fooEntry, false)
    expect(simpleBindingsPrivate._bindings.size).toStrictEqual(1)
    expect(simpleBindingsPrivate._shouldResolveOnceFlags.size).toStrictEqual(1)
    simpleBindings.clear()
    expect(simpleBindingsPrivate._bindings).toBeEmpty()
    expect(simpleBindingsPrivate._shouldResolveOnceFlags).toBeEmpty()
  })



  test('#contains() :: checks if an entry exists for a key', () => {
    const simpleBindings = new SimpleBindingManager()
    const fooSymbol = Symbol('foo')
    expect(simpleBindings.contains(fooSymbol)).toBeFalse()
    const Foo = (class Foo
    {})
    const fooEntry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    simpleBindings.set(fooSymbol, fooEntry, false)
    expect(simpleBindings.contains(fooSymbol)).toBeTrue()
    simpleBindings.unset(fooSymbol)
    expect(simpleBindings.contains(fooSymbol)).toBeFalse()
  })



  test('#get() :: gets the value for a key', () => {
    const simpleBindings = new SimpleBindingManager()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const fooEntry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    simpleBindings.set(fooSymbol, fooEntry, false)
    expect(simpleBindings.get(fooSymbol)).toBe(fooEntry)
  })

  test('#get() :: gets the value for a key :: when no entry exists, returns {null}', () => {
    const simpleBindings = new SimpleBindingManager()
    const fooSymbol = Symbol('foo')
    expect(simpleBindings.get(fooSymbol)).toBeNull()
  })



  test('#set() :: sets a key and value entry', () => {
    const simpleBindings = new SimpleBindingManager()
    const fooSymbol = Symbol('foo')
    expect(simpleBindings.contains(fooSymbol)).toBeFalse()
    const Foo = (class Foo
    {})
    const fooEntry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    simpleBindings.set(fooSymbol, fooEntry, false)
    expect(simpleBindings.contains(fooSymbol)).toBeTrue()
  })



  test('#shouldResolveOnce() :: checks if an entry should be resolved only once', () => {
    const simpleBindings = new SimpleBindingManager()
    const fooSymbol = Symbol('bar')
    const Foo = (class Foo
    {})
    const fooEntry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    simpleBindings.set(fooSymbol, fooEntry, false)
    expect(simpleBindings.shouldResolveOnce(fooSymbol)).toBeFalse()
    const barSymbol = Symbol('baz')
    const Bar = (class Bar
    {})
    const barEntry = new ClassBindingEntry(Bar) as IClassBindingEntry<typeof Bar>
    simpleBindings.set(barSymbol, barEntry, true)
    expect(simpleBindings.shouldResolveOnce(barSymbol)).toBeTrue()
  })

  test('#shouldResolveOnce() :: checks if an entry should be resolved only once :: when no entry exists, returns {null}', () => {
    const simpleBindings = new SimpleBindingManager()
    const fooSymbol = Symbol('foo')
    expect(simpleBindings.shouldResolveOnce(fooSymbol)).toBeNull()
  })



  test('#unset() :: unsets a key and value entry', () => {
    const simpleBindings = new SimpleBindingManager()
    const fooSymbol = Symbol('foo')
    const Foo = (class Foo
    {})
    const fooEntry = new ClassBindingEntry(Foo) as IClassBindingEntry<typeof Foo>
    simpleBindings.set(fooSymbol, fooEntry, false)
    expect(simpleBindings.contains(fooSymbol)).toBeTrue()
    simpleBindings.unset(fooSymbol)
    expect(simpleBindings.contains(fooSymbol)).toBeFalse()
  })
})
