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

import type { IConstructorParameterNamesParserConstructorSuperType as ConstructorSuperType } from './constructor-parameter-names-parser.i'
import type { IConstructorParameterNamesParserConstructorType as ConstructorType } from './constructor-parameter-names-parser.i'
import type * as esprima from 'esprima'
import type IConstructorParameterNamesParser from './constructor-parameter-names-parser.i'
import type IConstructorParameterNamesParserConstructor from './constructor-parameter-names-parser-constructor.i'

type EsprimaModuleType = { parseScript: (input: string) => esprima.Program };

type IConstructorParameterNamesParserPrivateType<ConstructorTypeT extends ConstructorSuperType> = (IConstructorParameterNamesParser &
                                                                                                   {
                                                                                                     _constructor: ConstructorType<ConstructorTypeT>,
                                                                                                     _parsedNames: (string[] |
                                                                                                                    null)
                                                                                                   });

const $p = <ConstructorTypeT extends ConstructorSuperType>(parser: IConstructorParameterNamesParser) => (parser as IConstructorParameterNamesParserPrivateType<ConstructorTypeT>)

describe('ConstructorParameterNamesParser', () => {
  let ConstructorParameterNamesParser: ConstructorType<IConstructorParameterNamesParserConstructor>
  let esprima: EsprimaModuleType
  let esprimaParseScriptSpy: jest.SpyInstance<esprima.Program, [ string ]>



  beforeEach(async () => {
    ConstructorParameterNamesParser = ((module) => module.default)(await import('./constructor-parameter-names-parser'))
    esprima = ((module) => module)(await import('esprima'))

    esprimaParseScriptSpy = jest.spyOn(esprima, 'parseScript')
  })



  test('#constructor() :: properly constructs a new instance', () => {
    const Foo = (class Foo
    {})
    const fooParameterNamesParser = new ConstructorParameterNamesParser(Foo)
    const fooParameterNamesParserPrivate = $p(fooParameterNamesParser)
    expect(fooParameterNamesParser).toBeInstanceOf(ConstructorParameterNamesParser)
    expect(fooParameterNamesParserPrivate._constructor).toBe(Foo)
    expect(fooParameterNamesParserPrivate._parsedNames).toBeNull()
    interface Bar
    {}
    interface BarConstructor
    {
      new(): Bar

      prototype: Bar
    }
    const Bar = function Bar(this: Bar) {} as Function as BarConstructor
    const barParameterNamesParser = new ConstructorParameterNamesParser(Bar)
    const barParameterNamesParserPrivate = $p(barParameterNamesParser)
    expect(barParameterNamesParser).toBeInstanceOf(ConstructorParameterNamesParser)
    expect(barParameterNamesParserPrivate._constructor).toBe(Bar)
    expect(barParameterNamesParserPrivate._parsedNames).toBeNull()
  })



  test('#parse() :: parses out the parameter names of a constructor', () => {
    const Foo = (class Foo
    {
      private _a: string
      private _b: number

      public constructor(a: string,
                         b: number)
      {
        this._a = a
        this._b = b
      }
    })
    const fooParameterNamesParser = new ConstructorParameterNamesParser(Foo)
    const fooParsedParameterNames = fooParameterNamesParser.parse()
    expect(esprimaParseScriptSpy).toHaveBeenCalledTimes(1)
    expect(esprimaParseScriptSpy).toHaveBeenCalledWith(`(${Foo})`)
    expect(fooParsedParameterNames).toStrictEqual([
      'a',
      'b'
    ])
    interface Bar
    {
      _a: string
      _b: number
    }
    interface BarConstructor
    {
      new(): Bar

      prototype: Bar
    }
    const Bar = function Bar(this: Bar,
                             a: string,
                             b: number) {
      this._a = a
      this._b = b
    } as Function as BarConstructor
    esprimaParseScriptSpy.mockClear()
    const barParameterNamesParser = new ConstructorParameterNamesParser(Bar)
    const barParsedParameterNames = barParameterNamesParser.parse()
    expect(esprimaParseScriptSpy).toHaveBeenCalledTimes(1)
    expect(esprimaParseScriptSpy).toHaveBeenCalledWith(`(${Bar})`)
    expect(barParsedParameterNames).toStrictEqual([
      'a',
      'b'
    ])
  })

  test('#parse() :: parses out the parameter names of a constructor :: when no parameters are declared in the constructor, returns an empty array', () => {
    const Foo = (class Foo
    {
      public constructor()
      {}
    })
    const fooParameterNamesParser = new ConstructorParameterNamesParser(Foo)
    const fooParsedParameterNames = fooParameterNamesParser.parse()
    expect(esprimaParseScriptSpy).toHaveBeenCalledTimes(1)
    expect(esprimaParseScriptSpy).toHaveBeenCalledWith(`(${Foo})`)
    expect(fooParsedParameterNames).toBeArrayOfSize(0)
    interface Bar
    {}
    interface BarConstructor
    {
      new(): Bar

      prototype: Bar
    }
    const Bar = function Bar(this: Bar) {} as Function as BarConstructor
    esprimaParseScriptSpy.mockClear()
    const barParameterNamesParser = new ConstructorParameterNamesParser(Bar)
    const barParsedParameterNames = barParameterNamesParser.parse()
    expect(esprimaParseScriptSpy).toHaveBeenCalledTimes(1)
    expect(esprimaParseScriptSpy).toHaveBeenCalledWith(`(${Bar})`)
    expect(barParsedParameterNames).toBeArrayOfSize(0)
  })

  test('#parse() :: parses out the parameter names of a constructor :: when the constructor is declared via a class with no explicit constructor method, returns an empty array', () => {
    const Foo = (class Foo
    {})
    const fooParameterNamesParser = new ConstructorParameterNamesParser(Foo)
    const fooParsedParameterNames = fooParameterNamesParser.parse()
    expect(esprimaParseScriptSpy).toHaveBeenCalledTimes(1)
    expect(esprimaParseScriptSpy).toHaveBeenCalledWith(`(${Foo})`)
    expect(fooParsedParameterNames).toBeArrayOfSize(0)
  })

  test('#parse() :: parses out the parameter names of a constructor :: when the parameter names of the constructor have already been parsed out, returns the already parsed values', () => {
    const Foo = (class Foo
    {
      private _a: string

      public constructor(a: string)
      {
        this._a = a
      }
    })
    const fooParameterNamesParser = new ConstructorParameterNamesParser(Foo)
    const fooParsedParameterNames1 = fooParameterNamesParser.parse()
    expect(esprimaParseScriptSpy).toHaveBeenCalledTimes(1)
    expect(esprimaParseScriptSpy).toHaveBeenCalledWith(`(${Foo})`)
    expect(fooParsedParameterNames1).toStrictEqual([ 'a' ])
    const fooParsedParameterNames2 = fooParameterNamesParser.parse()
    expect(fooParsedParameterNames2).toBe(fooParsedParameterNames1)
  })
})
