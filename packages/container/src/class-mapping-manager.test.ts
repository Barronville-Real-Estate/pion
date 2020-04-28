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

import type { IClassMappingManagerClassType as ClassType } from './class-mapping-manager.i'
import type { IClassMappingManagerConstructorParameterSymbolsType as ConstructorParameterSymbolsType } from './class-mapping-manager.i'
import type IClassMappingManager from './class-mapping-manager.i'
import type IClassMappingManagerConstructor from './class-mapping-manager-constructor.i'
import type { IConstructorParameterNamesParser } from '@pion/utilities'

type IClassMappingManagerPrivateType = (IClassMappingManager &
                                        {
                                          _parameterNamesParsers: Map<ClassType<any>, IConstructorParameterNamesParser>,
                                          _parameterSymbols: Map<ClassType<any>, ConstructorParameterSymbolsType>,
                                          _symbols: Map<ClassType<any>, symbol>
                                        });

const $p = (mappings: IClassMappingManager) => (mappings as IClassMappingManagerPrivateType)

describe('ClassMappingManager', () => {
  let ClassMappingManager: ClassType<IClassMappingManagerConstructor>



  beforeEach(async () => {
    ClassMappingManager = ((module) => module.default)(await import('./class-mapping-manager'))
  })



  test('#constructor() :: properly constructs a new instance', () => {
    const classMappings = new ClassMappingManager()
    const classMappingsPrivate = $p(classMappings)
    expect(classMappings).toBeInstanceOf(ClassMappingManager)
    expect(classMappingsPrivate._parameterNamesParsers).toBeInstanceOf(Map)
    expect(classMappingsPrivate._parameterNamesParsers).toBeEmpty()
    expect(classMappingsPrivate._parameterSymbols).toBeInstanceOf(Map)
    expect(classMappingsPrivate._parameterSymbols).toBeEmpty()
    expect(classMappingsPrivate._symbols).toBeInstanceOf(Map)
    expect(classMappingsPrivate._symbols).toBeEmpty()
  })



  test('#clear() :: clears the instance', () => {
    const classMappings = new ClassMappingManager()
    const classMappingsPrivate = $p(classMappings)
    expect(classMappingsPrivate._parameterNamesParsers).toBeEmpty()
    expect(classMappingsPrivate._parameterSymbols).toBeEmpty()
    expect(classMappingsPrivate._symbols).toBeEmpty()
    const Foo = (class Foo
    {})
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    classMappings.set(Foo, fooSymbol, { bar: barSymbol })
    expect(classMappingsPrivate._parameterNamesParsers.size).toStrictEqual(1)
    expect(classMappingsPrivate._parameterSymbols.size).toStrictEqual(1)
    expect(classMappingsPrivate._symbols.size).toStrictEqual(1)
    classMappings.clear()
    expect(classMappingsPrivate._parameterNamesParsers).toBeEmpty()
    expect(classMappingsPrivate._parameterSymbols).toBeEmpty()
    expect(classMappingsPrivate._symbols).toBeEmpty()
  })



  test('#contains() :: checks if a mapping exists for a class', () => {
    const classMappings = new ClassMappingManager()
    const Foo = (class Foo
    {})
    expect(classMappings.contains(Foo)).toBeFalse()
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    classMappings.set(Foo, fooSymbol, { bar: barSymbol })
    expect(classMappings.contains(Foo)).toBeTrue()
    classMappings.unset(Foo)
    expect(classMappings.contains(Foo)).toBeFalse()
  })



  test('#get() :: gets the mapping for a class', () => {
    const classMappings = new ClassMappingManager()
    const Foo = (class Foo
    {
      private _bar: number

      public constructor(bar: number)
      {
        this._bar = bar
      }
    })
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    classMappings.set(Foo, fooSymbol, { bar: barSymbol })
    expect(classMappings.get(Foo)).toStrictEqual({
      parameterNames: [ 'bar' ],
      parameterSymbols: { bar: barSymbol },
      symbol: fooSymbol
    })
  })



  test('#getParameterNames() :: gets the parameter names of a mapping for a class', () => {
    const classMappings = new ClassMappingManager()
    const Foo = (class Foo
    {
      private _bar: number

      public constructor(bar: number)
      {
        this._bar = bar
      }
    })
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    classMappings.set(Foo, fooSymbol, { bar: barSymbol })
    expect(classMappings.getParameterNames(Foo)).toStrictEqual([ 'bar' ])
  })



  test('#getParameterSymbols() :: gets the parameter symbols of a mapping for a class', () => {
    const classMappings = new ClassMappingManager()
    const Foo = (class Foo
    {
      private _bar: number

      public constructor(bar: number)
      {
        this._bar = bar
      }
    })
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    classMappings.set(Foo, fooSymbol, { bar: barSymbol })
    expect(classMappings.getParameterSymbols(Foo)).toStrictEqual({ bar: barSymbol })
  })



  test('#getSymbol() :: gets the symbol of a mapping for a class', () => {
    const classMappings = new ClassMappingManager()
    const Foo = (class Foo
    {
      private _bar: number

      public constructor(bar: number)
      {
        this._bar = bar
      }
    })
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    classMappings.set(Foo, fooSymbol, { bar: barSymbol })
    expect(classMappings.getSymbol(Foo)).toStrictEqual(fooSymbol)
  })



  test('#set() :: sets a class, symbol, and parameter symbols mapping', () => {
    const classMappings = new ClassMappingManager()
    const Foo = (class Foo
    {})
    expect(classMappings.contains(Foo)).toBeFalse()
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    classMappings.set(Foo, fooSymbol, { bar: barSymbol })
    expect(classMappings.contains(Foo)).toBeTrue()
  })



  test('#unset() :: unsets a class, symbol, and parameter symbols mapping', () => {
    const classMappings = new ClassMappingManager()
    const Foo = (class Foo
    {})
    const fooSymbol = Symbol('foo')
    const barSymbol = Symbol('bar')
    classMappings.set(Foo, fooSymbol, { bar: barSymbol })
    expect(classMappings.contains(Foo)).toBeTrue()
    classMappings.unset(Foo)
    expect(classMappings.contains(Foo)).toBeFalse()
  })
})
