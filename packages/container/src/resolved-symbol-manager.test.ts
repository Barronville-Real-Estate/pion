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
import type IResolvedSymbolManager from './resolved-symbol-manager.i'
import type IResolvedSymbolManagerConstructor from './resolved-symbol-manager-constructor.i'

type IResolvedSymbolManagerPrivateType = (IResolvedSymbolManager &
                                          { _symbols: Set<symbol> });

const $p = (symbols: IResolvedSymbolManager) => (symbols as IResolvedSymbolManagerPrivateType)

describe('ResolvedSymbolManager', () => {
  let ResolvedSymbolManager: ClassType<IResolvedSymbolManagerConstructor>



  beforeEach(async () => {
    ResolvedSymbolManager = ((module) => module.default)(await import('./resolved-symbol-manager'))
  })



  test('#constructor() :: properly constructs a new instance', () => {
    const resolvedSymbols = new ResolvedSymbolManager()
    const resolvedSymbolsPrivate = $p(resolvedSymbols)
    expect(resolvedSymbols).toBeInstanceOf(ResolvedSymbolManager)
    expect(resolvedSymbolsPrivate._symbols).toBeInstanceOf(Set)
    expect(resolvedSymbolsPrivate._symbols).toBeEmpty()
  })



  test('#add() :: adds a value entry', () => {
    const resolvedSymbols = new ResolvedSymbolManager()
    const fooSymbol = Symbol('foo')
    expect(resolvedSymbols.contains(fooSymbol)).toBeFalse()
    resolvedSymbols.add(fooSymbol)
    expect(resolvedSymbols.contains(fooSymbol)).toBeTrue()
  })



  test('#clear() :: clears the instance', () => {
    const resolvedSymbols = new ResolvedSymbolManager()
    const resolvedSymbolsPrivate = $p(resolvedSymbols)
    expect(resolvedSymbolsPrivate._symbols).toBeEmpty()
    const fooSymbol = Symbol('foo')
    resolvedSymbols.add(fooSymbol)
    expect(resolvedSymbolsPrivate._symbols.size).toStrictEqual(1)
    resolvedSymbols.clear()
    expect(resolvedSymbolsPrivate._symbols).toBeEmpty()
  })



  test('#contains() :: checks if an entry exists for a value', () => {
    const resolvedSymbols = new ResolvedSymbolManager()
    const fooSymbol = Symbol('foo')
    expect(resolvedSymbols.contains(fooSymbol)).toBeFalse()
    resolvedSymbols.add(fooSymbol)
    expect(resolvedSymbols.contains(fooSymbol)).toBeTrue()
    resolvedSymbols.remove(fooSymbol)
    expect(resolvedSymbols.contains(fooSymbol)).toBeFalse()
  })



  test('#remove() :: removes a value entry', () => {
    const resolvedSymbols = new ResolvedSymbolManager()
    const fooSymbol = Symbol('foo')
    resolvedSymbols.add(fooSymbol)
    expect(resolvedSymbols.contains(fooSymbol)).toBeTrue()
    resolvedSymbols.remove(fooSymbol)
    expect(resolvedSymbols.contains(fooSymbol)).toBeFalse()
  })
})
