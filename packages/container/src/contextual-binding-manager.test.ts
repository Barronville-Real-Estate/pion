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
import type IBindingEntry from './binding-entry.i'
import type IClassBindingEntry from './class-binding-entry.i'
import type IClassBindingEntryConstructor from './class-binding-entry-constructor.i'
import type IContextualBindingManager from './contextual-binding-manager.i'
import type IContextualBindingManagerConstructor from './contextual-binding-manager-constructor.i'

type IContextualBindingManagerPrivateType = (IContextualBindingManager &
                                             { _bindings: Map<symbol, Map<symbol, IBindingEntry>> });

const $p = (bindings: IContextualBindingManager) => (bindings as IContextualBindingManagerPrivateType)

describe('ContextualBindingManager', () => {
  let ClassBindingEntry: ClassType<IClassBindingEntryConstructor>
  let ContextualBindingManager: ClassType<IContextualBindingManagerConstructor>



  beforeEach(async () => {
    ClassBindingEntry = ((module) => module.default)(await import('./class-binding-entry'))
    ContextualBindingManager = ((module) => module.default)(await import('./contextual-binding-manager'))
  })



  test('#constructor() :: properly constructs a new instance', () => {
    const contextualBindings = new ContextualBindingManager()
    const contextualBindingsPrivate = $p(contextualBindings)
    expect(contextualBindings).toBeInstanceOf(ContextualBindingManager)
    expect(contextualBindingsPrivate._bindings).toBeInstanceOf(Map)
    expect(contextualBindingsPrivate._bindings).toBeEmpty()
  })



  test('#clear() :: clears the instance', () => {
    const contextualBindings = new ContextualBindingManager()
    const contextualBindingsPrivate = $p(contextualBindings)
    expect(contextualBindingsPrivate._bindings).toBeEmpty()
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    const Bar = (class Bar
    {})
    const entry = new ClassBindingEntry(Bar) as IClassBindingEntry<typeof Bar>
    contextualBindings.setDependent(fooSymbol, barSymbol, entry)
    expect(contextualBindingsPrivate._bindings.size).toStrictEqual(1)
    contextualBindings.clear()
    expect(contextualBindingsPrivate._bindings).toBeEmpty()
  })



  test('#contains() :: checks if an entry exists for a key', () => {
    const contextualBindings = new ContextualBindingManager()
    const fooSymbol = Symbol('foo')
    expect(contextualBindings.contains(fooSymbol)).toBeFalse()
    const barSymbol = Symbol('bar')
    const Bar = (class Bar
    {})
    const entry = new ClassBindingEntry(Bar) as IClassBindingEntry<typeof Bar>
    contextualBindings.setDependent(fooSymbol, barSymbol, entry)
    expect(contextualBindings.contains(fooSymbol)).toBeTrue()
    contextualBindings.unsetDependent(fooSymbol, barSymbol)
    expect(contextualBindings.contains(fooSymbol)).toBeFalse()
  })



  test('#containsDependent() :: checks if an entry exists for a dependent key of a key', () => {
    const contextualBindings = new ContextualBindingManager()
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    expect(contextualBindings.containsDependent(fooSymbol, barSymbol)).toBeFalse()
    const Bar = (class Bar
    {})
    const barEntry = new ClassBindingEntry(Bar) as IClassBindingEntry<typeof Bar>
    contextualBindings.setDependent(fooSymbol, barSymbol, barEntry)
    expect(contextualBindings.containsDependent(fooSymbol, barSymbol)).toBeTrue()
    const bazSymbol = Symbol('baz')
    expect(contextualBindings.containsDependent(fooSymbol, bazSymbol)).toBeFalse()
    const Baz = (class Baz
    {})
    const bazEntry = new ClassBindingEntry(Baz) as IClassBindingEntry<typeof Baz>
    contextualBindings.setDependent(fooSymbol, bazSymbol, bazEntry)
    expect(contextualBindings.containsDependent(fooSymbol, bazSymbol)).toBeTrue()
    contextualBindings.unsetDependent(fooSymbol, bazSymbol)
    expect(contextualBindings.containsDependent(fooSymbol, bazSymbol)).toBeFalse()
    expect(contextualBindings.contains(fooSymbol)).toBeTrue()
  })



  test('#getDependent() :: gets the entry for a dependent key of a key', () => {
    const contextualBindings = new ContextualBindingManager()
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    const Bar = (class Bar
    {})
    const entry = new ClassBindingEntry(Bar) as IClassBindingEntry<typeof Bar>
    contextualBindings.setDependent(fooSymbol, barSymbol, entry)
    expect(contextualBindings.getDependent(fooSymbol, barSymbol)).toBe(entry)
  })

  test('#getDependent() :: gets the entry for a dependent key of a key :: when no entry exists, returns {null}', () => {
    const contextualBindings = new ContextualBindingManager()
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    expect(contextualBindings.getDependent(fooSymbol, barSymbol)).toBeNull()
  })



  test('#setDependent() :: sets a key, dependent key, and value entry', () => {
    const contextualBindings = new ContextualBindingManager()
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    expect(contextualBindings.containsDependent(fooSymbol, barSymbol)).toBeFalse()
    const Bar = (class Bar
    {})
    const entry = new ClassBindingEntry(Bar) as IClassBindingEntry<typeof Bar>
    contextualBindings.setDependent(fooSymbol, barSymbol, entry)
    expect(contextualBindings.containsDependent(fooSymbol, barSymbol)).toBeTrue()
  })



  test('#unsetDependent() :: unsets a key, dependent key, and value entry', () => {
    const contextualBindings = new ContextualBindingManager()
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    const Bar = (class Bar
    {})
    const entry = new ClassBindingEntry(Bar) as IClassBindingEntry<typeof Bar>
    contextualBindings.setDependent(fooSymbol, barSymbol, entry)
    expect(contextualBindings.containsDependent(fooSymbol, barSymbol)).toBeTrue()
    contextualBindings.unsetDependent(fooSymbol, barSymbol)
    expect(contextualBindings.containsDependent(fooSymbol, barSymbol)).toBeFalse()
  })
})
